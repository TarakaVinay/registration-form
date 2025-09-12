import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Trash2, Check, X } from "lucide-react"

// ✅ Popup helper
const showMessage = (msg: string, type: "success" | "error" = "success") => {
  if (type === "error") {
    window.alert("❌ " + msg)
  } else {
    window.alert("✅ " + msg)
  }
}

export function Registrationpage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Registration Page</h1>
      <RegistrationForm />
    </div>
  )
}

// ✅ Registration Form Component
export function RegistrationForm() {
  const PORT = 4000
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    resume: null as File | null,
  })

  const [submissions, setSubmissions] = useState<
    {
      id: number
      first_name: string
      last_name: string
      phone: string
      email: string
      resume_name: string
    }[]
  >([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    resume_name: "",
  })

  // 👉 1. Fetch all registrations (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:${PORT}/registration`)
        const data = await res.json()
        setSubmissions(data.data || [])
      } catch (error) {
        console.error("❌ Error fetching registrations:", error)
        showMessage("Error fetching registrations", "error")
      }
    }
    fetchData()
  }, [])

  // 👉 Handle input + resume validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target

    if (name === "resume") {
      if (files && files[0]) {
        const file = files[0]
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
        if (!allowedTypes.includes(file.type)) {
          showMessage("Only PDF, DOC, or DOCX files are allowed", "error")
          e.target.value = "" // reset input
          return
        }
        setFormData((prev) => ({ ...prev, resume: file }))
      } else {
        setFormData((prev) => ({ ...prev, resume: null }))
      }
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 👉 2. Add new registration (POST)
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!formData.resume) {
  //     showMessage("Please upload your resume before submitting!", "error")
  //     return
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:${PORT}/registration`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         first_name: formData.firstName,
  //         last_name: formData.lastName,
  //         phone: formData.phone,
  //         email: formData.email,
  //         resume_name: formData.resume.name,
  //       }),
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       showMessage(data.message || "Failed to create registration!", "error")
  //       return
  //     }

  //     setSubmissions([...submissions, data.data])
  //     setFormData({ firstName: "", lastName: "", phone: "", email: "", resume: null })
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = ""
  //     }

  //     showMessage(data.message || "Registration created successfully")
  //   } catch (error) {
  //     console.error("❌ Error creating registration:", error)
  //     showMessage("Error creating registration", "error")
  //   }
  // }
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.resume) {
    showMessage("Please upload your resume before submitting!", "error");
    return;
  }

  const form = new FormData();
  form.append("first_name", formData.firstName);
  form.append("last_name", formData.lastName);
  form.append("phone", formData.phone);
  form.append("email", formData.email);
  form.append("resume", formData.resume); // ✅ important: actual file

  try {
    const response = await fetch(`http://localhost:${PORT}/registration`, {
      method: "POST",
      body: form, // ✅ do NOT set Content-Type manually
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Failed to create registration", "error");
      return;
    }

    setSubmissions([...submissions, data.data]);

    setFormData({ firstName: "", lastName: "", phone: "", email: "", resume: null });
    if (fileInputRef.current) fileInputRef.current.value = "";

    showMessage(data.message || "Registration created successfully");
  } catch (error) {
    console.error("❌ Error creating registration:", error);
    showMessage("Error creating registration", "error");
  }
};




  // 📝 Start editing
  const startEditing = (entry: any) => {
    setEditingId(entry.id)
    setEditData({
      first_name: entry.first_name,
      last_name: entry.last_name,
      phone: entry.phone,
      email: entry.email,
      resume_name: entry.resume_name,
    })
  }

  // 👉 3. Save edit (PUT)
  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/registration/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (!response.ok) {
        showMessage(data.message || "Failed to update registration!", "error")
        return
      }

      setSubmissions((prev) =>
        prev.map((entry) => (entry.id === editingId ? data.data : entry))
      )

      setEditingId(null)
      showMessage(data.message || "Registration updated successfully")
    } catch (error) {
      console.error("❌ Error updating registration:", error)
      showMessage("Error updating registration", "error")
    }
  }

  // ❌ Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
  }

  // 👉 4. Delete entry (DELETE)
  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/registration/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        showMessage(data.message || "Failed to delete registration!", "error")
        return
      }

      setSubmissions((prev) => prev.filter((entry) => entry.id !== id))
      showMessage(data.message || "Registration deleted successfully")
    } catch (error) {
      console.error("❌ Error deleting registration:", error)
      showMessage("Error deleting registration", "error")
    }
  }

  return (
    <>
      {/* Form */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Registration Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                if (value.length <= 10) {
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
              }}
              pattern="\d{10}"
              maxLength={10}
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Resume upload */}
            <div>
              <Input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                ref={fileInputRef}
                required
              />
              {formData.resume && (
                <div className="flex justify-between items-center bg-gray-100 p-2 mt-2 rounded">
                  <span>{formData.resume.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, resume: null })}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table of Submissions */}
      {submissions.length > 0 && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Submitted Entries</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-center">#</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">First Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Last Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Phone</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Email</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Resume</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center">{entry.id}</td>

                      {editingId === entry.id ? (
                        <>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <Input
                              className="w-full text-center"
                              value={editData.first_name}
                              onChange={(e) =>
                                setEditData({ ...editData, first_name: e.target.value })
                              }
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <Input
                              className="w-full text-center"
                              value={editData.last_name}
                              onChange={(e) =>
                                setEditData({ ...editData, last_name: e.target.value })
                              }
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <Input
                              className="w-full text-center"
                              value={editData.phone}
                              onChange={(e) =>
                                setEditData({ ...editData, phone: e.target.value })
                              }
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <Input
                              className="w-full text-center"
                              value={editData.email}
                              onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                              }
                            />
                          </td>
                          {/* Resume file input in edit */}
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {editData.resume_name && (
                              <a
                                href={`http://localhost:${PORT}/uploads/${editData.resume_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs mb-1 block"
                              >
                                {editData.resume_name}
                              </a>
                            )}
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setEditData({
                                    ...editData,
                                    resume_name: e.target.files[0].name,
                                  })
                                }
                              }}
                            />
                            {editData.resume_name && (
                              <div className="mt-1 flex justify-between items-center">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setEditData({ ...editData, resume_name: "" })
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex justify-center gap-2">
                              <Button size="sm" onClick={saveEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {entry.first_name}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {entry.last_name}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {entry.phone}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {entry.email}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {entry.resume_name ? (
                              <a
                                href={`http://localhost:${PORT}/uploads/${entry.resume_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {entry.resume_name}
                              </a>
                            ) : (
                              "No Resume"
                            )}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(entry)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteEntry(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
