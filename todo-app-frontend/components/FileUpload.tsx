import React, { useState, useEffect } from "react";

interface FileMeta {
  id: number;
  filename: string;
  mimetype: string;
  created_at: string;
}

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileMeta[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const fetchFiles = async () => {
    const res = await fetch("http://localhost:4000/files");
    const data = await res.json();
    setFiles(data);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);
      setFile(null);
      await fetchFiles();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.filename} - <a href={`http://localhost:5000/files/${f.id}`} target="_blank">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
