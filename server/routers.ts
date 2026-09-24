import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createMediaFile, listMediaFiles } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const uploadInput = z.object({
  originalName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(128),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  base64: z.string().min(1),
});

function safeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120) || "archivo";
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  files: router({
    list: protectedProcedure.query(({ ctx }) => listMediaFiles(ctx.user.id)),
    upload: protectedProcedure.input(uploadInput).mutation(async ({ ctx, input }) => {
      if (!/^image\//.test(input.mimeType) && input.mimeType !== "application/pdf" && !/^text\//.test(input.mimeType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Solo se admiten imágenes, PDF y archivos de texto." });
      }

      const fileBuffer = Buffer.from(input.base64, "base64");
      if (fileBuffer.byteLength !== input.sizeBytes) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "El archivo recibido no coincide con su tamaño." });
      }

      const requestedKey = `user-${ctx.user.id}/${Date.now()}-${safeFileName(input.originalName)}`;
      const stored = await storagePut(requestedKey, fileBuffer, input.mimeType);
      const record = await createMediaFile({
        ownerId: ctx.user.id,
        originalName: input.originalName,
        storageKey: stored.key,
        url: stored.url,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      });

      if (!record) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo registrar el archivo." });
      }

      return record;
    }),
  }),
});

export type AppRouter = typeof appRouter;
