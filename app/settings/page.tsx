"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UserProfile } from "@/lib/utils/Types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const EMPTY: UserProfile = {
  //add default image for user:
  imageUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  age: "",
  weight: "",
  height: "",
};

const VALIDATORS: Partial<
  Record<keyof UserProfile, (v: string) => string | null>
> = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Invalid email"),
  phoneNumber: (v) =>
    !v || /^\+?[\d\s\-()]{8}$/.test(v) ? null : "Invalid phone",
  age: (v) =>
    !v || (Number(v) >= 1 && Number(v) <= 100) ? null : "Age must be 1–100",
  weight: (v) =>
    !v || (Number(v) >= 1 && Number(v) <= 150) ? null : "Weight 1–150 kg",
  height: (v) =>
    !v || (Number(v) >= 30 && Number(v) <= 300) ? null : "Height 30–300 cm",
};

function validate(
  user: UserProfile,
): Partial<Record<keyof UserProfile, string>> {
  const errors: Partial<Record<keyof UserProfile, string>> = {};
  (Object.keys(VALIDATORS) as (keyof UserProfile)[]).forEach((k) => {
    const err = VALIDATORS[k]?.(user[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile>(EMPTY);
  const [draft, setDraft] = useState<UserProfile>(EMPTY);
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfile, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user: u }) => {
        const parsed: UserProfile = {
          imageUrl: u?.imageUrl ?? "",
          firstName: u?.firstName ?? "",
          lastName: u?.lastName ?? "",
          email: u?.email ?? "",
          phoneNumber: u?.phoneNumber ?? "",
          age: String(u?.age ?? ""),
          weight: String(u?.weight ?? ""),
          height: String(u?.height ?? ""),
        };
        setUser(parsed);
        setDraft(parsed);
      })
      .catch(() => showToast("Failed to load profile", false));
  }, []);

  // Clean up object URLs
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type))
      return showToast("Only JPEG/PNG/WebP/GIF allowed", false);
    if (file.size > MAX_FILE_BYTES)
      return showToast("Image must be under 5 MB", false);
    setImageFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setDraft(user);
    setErrors({});
    setEdit(true);
  };
  const handleCancel = () => {
    setDraft(user);
    setErrors({});
    setImageFile(null);
    setPreviewUrl("");
    setEdit(false);
  };

  const handleChange = (key: keyof UserProfile, value: string) => {
    const safe = value.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 200);
    setDraft((d) => ({ ...d, [key]: safe }));
    const err = VALIDATORS[key]?.(safe);
    setErrors((e) => ({ ...e, [key]: err ?? undefined }));
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const body = new FormData();
      (Object.keys(draft) as (keyof UserProfile)[])
        .filter((k) => k !== "imageUrl")
        .forEach((k) => body.append(k, draft[k]));
      if (imageFile) body.append("image", imageFile);

      const res = await fetch("/api/auth/me/update", { method: "PATCH", body });
      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: "Update failed" }));
        showToast(error ?? "Update failed", false);
        return;
      }
      const { user: u } = await res.json();
      const updated: UserProfile = {
        imageUrl: u?.imageUrl ?? draft.imageUrl,
        firstName: u?.firstName ?? draft.firstName,
        lastName: u?.lastName ?? draft.lastName,
        email: u?.email ?? draft.email,
        phoneNumber: u?.phoneNumber ?? draft.phoneNumber,
        age: String(u?.age ?? draft.age),
        weight: String(u?.weight ?? draft.weight),
        height: String(u?.height ?? draft.height),
      };
      setUser(updated);
      setDraft(updated);
      setImageFile(null);
      setPreviewUrl("");
      setEdit(false);
      showToast("Profile saved!", true);
    } catch {
      showToast("Network error. Try again.", false);
    } finally {
      setSaving(false);
    }
  };

  const textFields: [keyof UserProfile, string, string][] = [
    ["firstName", "First Name", "text"],
    ["lastName", "Last Name", "text"],
    ["email", "Email Address", "email"],
    ["phoneNumber", "Phone Number", "tel"],
  ];
  const metricFields: [keyof UserProfile, string, string][] = [
    ["age", "AGE", "Years"],
    ["weight", "WEIGHT", "kg"],
    ["height", "HEIGHT", "cm"],
  ];
  //add default image for user:
  const displaySrc = previewUrl || user.imageUrl || "/images/logo.png";

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <main className="min-h-screen bg-[#f4f6fb] px-4 py-8">
        {toast && (
          <div
            className={`fixed top-28 left-1/2 md:left-auto md:right-4 z-50 w-[90%] md:w-auto max-w-sm -translate-x-1/2 md:translate-x-0 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 animate-[toast_0.4s_ease]
    ${toast.ok ? "bg-emerald-600" : "bg-red-500"}`}
          >
            {toast.msg}
          </div>
        )}
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-8 text-white shadow-xl">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative flex items-center gap-6">
              <button
                onClick={() => edit && fileRef.current?.click()}
                className={`group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white/40 shadow-lg
                ${edit ? "cursor-pointer" : "cursor-default"}`}
                title={edit ? "Change photo" : ""}
                type="button"
              >
                <Image
                  src={displaySrc}
                  alt="Profile"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {edit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-bold text-white">CHANGE</span>
                  </div>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {user.firstName || "Your"} {user.lastName || "Name"}
                </h1>
                <p className="mt-0.5 text-sm text-emerald-200">
                  {user.email || "Manage your account"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Personal Information
              </h2>
              <div className="flex gap-2">
                {edit && (
                  <button
                    onClick={handleCancel}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={edit ? handleSave : handleEdit}
                  disabled={saving}
                  className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving…" : edit ? "Save" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {textFields.map(([key, label, type]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={edit ? draft[key] : user[key]}
                    disabled={!edit}
                    autoComplete="off"
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition
                    ${edit ? "bg-[#eef4ff] ring-1 ring-emerald-200 focus:ring-emerald-500" : "bg-[#f4f6fb] cursor-default"}
                    ${errors[key] ? "ring-1 ring-red-400" : ""}`}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {metricFields.map(([key, label, unit]) => (
                <div
                  key={key}
                  className="rounded-2xl bg-[#f4f6fb] p-5 text-center"
                >
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">
                    {label}
                  </p>
                  <input
                    type="number"
                    value={edit ? draft[key] : user[key]}
                    disabled={!edit}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="mx-auto mt-2 w-24 bg-transparent text-center text-3xl font-extrabold text-emerald-700 outline-none disabled:cursor-default"
                  />
                  <p className="text-xs text-gray-400">{unit}</p>
                  {errors[key] && (
                    <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
