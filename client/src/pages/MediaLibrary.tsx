import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, CloudUpload, Download, FileText, Image as ImageIcon, Loader2, LogOut, ShieldCheck, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

export default function MediaLibrary() {
  const { user, loading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();
  const filesQuery = trpc.files.list.useQuery(undefined, { enabled: Boolean(user) });
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: async () => {
      await utils.files.list.invalidate();
      toast.success("Archivo guardado en la biblioteca");
    },
    onError: (error) => toast.error(error.message || "No se pudo subir el archivo"),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [pendingName, setPendingName] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    const file = fileList[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("El archivo supera el límite de 10 MB");
      return;
    }
    if (!file.type || (!file.type.startsWith("image/") && file.type !== "application/pdf" && !file.type.startsWith("text/"))) {
      toast.error("Solo se admiten imágenes, PDF y archivos de texto");
      return;
    }

    setPendingName(file.name);
    try {
      const base64 = await fileToBase64(file);
      await uploadMutation.mutateAsync({
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        base64,
      });
    } catch (error) {
      if (!(error instanceof Error && error.message === "No se pudo subir el archivo")) {
        toast.error("No se pudo leer o subir el archivo");
      }
    } finally {
      setPendingName(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFiles(event.dataTransfer.files);
  };

  if (loading || !user) {
    return <div className="media-loading"><Loader2 className="animate-spin" size={22} /> Preparando tu biblioteca…</div>;
  }

  const files = filesQuery.data ?? [];

  return (
    <div className="media-shell">
      <header className="media-header">
        <a href="/" className="media-brand" aria-label="Volver a Planeta Café"><span className="media-brand-orbit">✳</span><span><strong>Planeta</strong><em>Café</em></span></a>
        <div className="media-user"><span>{user.name || user.email || "Cuenta"}</span><button onClick={() => void logout()} title="Cerrar sesión"><LogOut size={16} /></button></div>
      </header>

      <main className="media-main">
        <div className="media-breadcrumb"><a href="/"><ArrowLeft size={15} /> Volver al sitio</a><span>/</span><span>Biblioteca privada</span></div>
        <div className="media-heading"><div><p className="media-eyebrow"><ShieldCheck size={15} /> Área privada</p><h1>Tu biblioteca<br /><i>de archivos.</i></h1><p className="media-intro">Sube imágenes, PDFs y documentos para tenerlos disponibles en tus proyectos de Planeta Café.</p></div><div className="media-count"><strong>{files.length.toString().padStart(2, "0")}</strong><span>archivos<br />guardados</span></div></div>

        <section className={`upload-zone ${isDragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop}>
          <input ref={inputRef} type="file" accept="image/*,application/pdf,text/plain,text/csv" hidden onChange={(event) => { if (event.target.files) void handleFiles(event.target.files); }} />
          <div className="upload-icon"><CloudUpload size={28} /></div>
          <div><h2>{pendingName ? "Subiendo archivo…" : "Suelta un archivo aquí"}</h2><p>{pendingName ? pendingName : "o selecciónalo desde tu dispositivo · máximo 10 MB"}</p></div>
          <button className="media-button media-button-accent" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>{uploadMutation.isPending ? <Loader2 className="animate-spin" size={17} /> : <UploadCloud size={17} />} Seleccionar archivo</button>
        </section>

        <div className="library-toolbar"><div><span className="media-eyebrow">Archivos guardados</span><h2>Últimos documentos</h2></div><div className="storage-note"><CheckCircle2 size={16} /> Almacenamiento seguro</div></div>
        {filesQuery.isLoading ? <div className="media-empty"><Loader2 className="animate-spin" size={22} /><span>Cargando archivos…</span></div> : files.length === 0 ? <div className="media-empty"><FileText size={29} /><span>Aún no hay archivos. Sube el primero para empezar.</span></div> : <div className="media-grid">{files.map((file) => <article className="file-card" key={file.id}><div className={`file-preview ${file.mimeType.startsWith("image/") ? "has-image" : ""}`}>{file.mimeType.startsWith("image/") ? <img src={file.url} alt={file.originalName} /> : file.mimeType === "application/pdf" ? <FileText size={32} /> : <ImageIcon size={32} />}</div><div className="file-card-body"><div><h3 title={file.originalName}>{file.originalName}</h3><p>{formatBytes(file.sizeBytes)} · {formatDate(file.createdAt)}</p></div><a href={file.url} target="_blank" rel="noreferrer" className="file-download" aria-label={`Abrir ${file.originalName}`}><Download size={16} /></a></div></article>)}</div>}
        <p className="media-footnote">Los archivos se guardan en almacenamiento S3-compatible y solo son visibles para tu cuenta. Puedes abrirlos cuando quieras desde su enlace seguro.</p>
      </main>
    </div>
  );
}
