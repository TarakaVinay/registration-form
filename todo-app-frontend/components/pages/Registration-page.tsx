"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, Check, X } from "lucide-react";

const PORT = 4000;

const showMessage = (msg: string, type: "success" | "error" = "success") => {
  if (type === "error") {
    window.alert("❌ " + msg);
  } else {
    window.alert("✅ " + msg);
  }
};

// ✅ HallticketPage Component (with FIXED useEffect)
function HallticketPage({ hallticket, onClose }: { hallticket: string; onClose: () => void }) {
  const [results, setResults] = useState<{ sem1?: any; sem2?: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hallticket) return; // ✅ Avoid calling API with empty hallticket

    const fetchHallticket = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:${PORT}/registration/${hallticket}`);

       if (!response.ok) {
  console.error(`Failed to fetch hallticket: ${response.status} ${response.statusText}`);
  setResults({ sem1: "", sem2: "" }); // ✅ Explicitly reset results
  return;
}


        const data = await response.json();

        setResults({
          sem1: data?.sem1 ?? "",
          sem2: data?.sem2 ?? "",
        });
      } catch (error) {
        console.error("Error fetching hallticket:", error);
        setResults({});
      } finally {
        setLoading(false);
      }
    };

    fetchHallticket();
  }, [hallticket, PORT]); // ✅ Works fine now (inside component)

  if (loading) return <p className="p-4">Loading...</p>;
  if (!results.sem1 && !results.sem2) return <p className="p-4">No results found</p>;

  return (
    <Card className="mt-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Results for {hallticket}</h2>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {results.sem1 && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Semester 1</h3>
            <p>M1: {results.sem1.m1}</p>
            <p>English: {results.sem1.eng}</p>
            <p>Chemistry: {results.sem1.che}</p>
            <p>BEE: {results.sem1.bee}</p>
          </div>
        )}
        {results.sem2 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Semester 2</h3>
            <p>M2: {results.sem2.m2}</p>
            <p>Physics: {results.sem2.phy}</p>
            <p>EG: {results.sem2.eg}</p>
            <p>CPP: {results.sem2.cpp}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Registrationpage() {
  const [selectedHallticket, setSelectedHallticket] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Registration Page</h1>
      <RegistrationForm onHallticketClick={(ht) => setSelectedHallticket(ht)} />

      {selectedHallticket && (
        <HallticketPage hallticket={selectedHallticket} onClose={() => setSelectedHallticket(null)} />
      )}
    </div>
  );
}

export function RegistrationForm({ onHallticketClick }: { onHallticketClick: (ht: string) => void }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    hall_ticket: "",
    sem1: { M1: "", English: "", Chemistry: "", BEE: "" },
    sem2: { M2: "", Physics: "", EG: "", Cpp: "" },
  });

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:${PORT}/registration`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error(error);
        showMessage("Error fetching registrations", "error");
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sem?: "sem1" | "sem2",
    subject?: string
  ) => {
    if (sem && subject) {
      setFormData((prev) => ({
        ...prev,
        [sem]: { ...prev[sem], [subject]: e.target.value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const normalizeMarks = (marks: Record<string, string>) => {
    const normalized: Record<string, number | null> = {};
    Object.keys(marks).forEach((key) => {
      const value = marks[key];
      normalized[key] = value === "" || value === null ? null : Number(value);
    });
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        hall_ticket: formData.hall_ticket,
        sem1: normalizeMarks(formData.sem1),
        sem2: normalizeMarks(formData.sem2),
      };

      const response = await fetch(`http://localhost:${PORT}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        showMessage(data.message || "Failed to create registration!", "error");
        return;
      }

      setSubmissions([...submissions, data.data]);
      setFormData({
        first_name: "",
        last_name: "",
        hall_ticket: "",
        sem1: { M1: "", English: "", Chemistry: "", BEE: "" },
        sem2: { M2: "", Physics: "", EG: "", Cpp: "" },
      });
      showMessage(data.message || "Registration created successfully");
    } catch (error) {
      console.error(error);
      showMessage("Error creating registration", "error");
    }
  };

  const startEditing = (entry: any) => {
    setEditingId(entry.id);
    setEditData({ ...entry });
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/registration/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      if (!response.ok) {
        showMessage(data.message || "Failed to update registration!", "error");
        return;
      }
      setSubmissions((prev) =>
        prev.map((entry) => (entry.id === editingId ? data.data : entry))
      );
      setEditingId(null);
      showMessage(data.message || "Registration updated successfully");
    } catch (error) {
      console.error(error);
      showMessage("Error updating registration", "error");
    }
  };

  const cancelEdit = () => setEditingId(null);

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/registration/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        showMessage(data.message || "Failed to delete registration!", "error");
        return;
      }
      setSubmissions((prev) => prev.filter((entry) => entry.id !== id));
      showMessage(data.message || "Registration deleted successfully");
    } catch (error) {
      console.error(error);
      showMessage("Error deleting registration", "error");
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Student Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <Input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
              <Input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
            </div>

            <Input
              type="text"
              name="hall_ticket"
              placeholder="Hall Ticket"
              value={formData.hall_ticket}
              onChange={handleChange}
              required
            />

            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ flex: 1 }}>
                <h3 className="font-semibold mb-2">Semester 1</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {Object.keys(formData.sem1).map((sub) => (
                    <Input
                      key={sub}
                      type="number"
                      placeholder={sub}
                      value={(formData.sem1 as any)[sub]}
                      onChange={(e) => handleChange(e, "sem1", sub)}
                      style={{ flex: "1 1 45%" }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="font-semibold mb-2">Semester 2</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {Object.keys(formData.sem2).map((sub) => (
                    <Input
                      key={sub}
                      type="number"
                      placeholder={sub}
                      value={(formData.sem2 as any)[sub]}
                      onChange={(e) => handleChange(e, "sem2", sub)}
                      style={{ flex: "1 1 45%" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      {submissions.length > 0 && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Submitted Entries</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">First Name</th>
                    <th className="border p-2">Last Name</th>
                    <th className="border p-2">Hall Ticket</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((entry) => (
                    <tr key={entry.id}>
                      <td className="border p-2 text-center">{entry.id}</td>

                      {editingId === entry.id ? (
                        <>
                          <td className="border p-2">
                            <Input
                              value={editData.first_name}
                              onChange={(e) =>
                                setEditData({ ...editData, first_name: e.target.value })
                              }
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={editData.last_name}
                              onChange={(e) =>
                                setEditData({ ...editData, last_name: e.target.value })
                              }
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={editData.hall_ticket}
                              onChange={(e) =>
                                setEditData({ ...editData, hall_ticket: e.target.value })
                              }
                            />
                          </td>
                          <td className="border p-2">
                            <div className="flex gap-2 justify-center">
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
                          <td className="border p-2">{entry.first_name}</td>
                          <td className="border p-2">{entry.last_name}</td>
                          <td
                            className="border p-2 cursor-pointer text-blue-600 underline"
                            onClick={() => onHallticketClick(entry.hall_ticket)}
                          >
                            {entry.hall_ticket}
                          </td>
                          <td className="border p-2">
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
                                className="text-destructive"
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
  );
}
