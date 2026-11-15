"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, loading, setProfile } = useUser();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    gender: "",
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        gender: profile.gender ?? "",
        bio: profile.bio ?? "",
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran maksimal 2MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      showToast("Gagal upload: " + uploadError.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const newUrl = `${publicUrl.publicUrl}?t=${Date.now()}`;
    await supabase
      .from("users")
      .update({ avatar_url: newUrl })
      .eq("id", user.id);

    setAvatarPreview(newUrl);
    showToast("Foto profil diperbarui");
  }

  async function handleSave() {
    if (!user) return;
    if (!form.full_name.trim()) {
      showToast("Nama lengkap wajib diisi");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        gender: form.gender,
        bio: form.bio,
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      showToast("Gagal menyimpan: " + error.message);
    } else {
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
      showToast("Profil berhasil diperbarui");
    }
  }

  async function handleChangePassword() {
    if (passwordForm.new.length < 6) {
      showToast("Password minimal 6 karakter");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      showToast("Konfirmasi password tidak cocok");
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.new,
    });
    if (error) {
      showToast("Gagal: " + error.message);
    } else {
      setPasswordModal(false);
      setPasswordForm({ old: "", new: "", confirm: "" });
      showToast("Kata sandi berhasil diubah");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className="fixed top-20 left-1/2 z-[200] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-float dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] p-6 text-center shadow-soft">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--border)] bg-slate-100 dark:bg-slate-800">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--muted)]">
                {profile?.full_name?.[0] ?? "U"}
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 p-1.5 text-white shadow-soft dark:bg-white dark:text-slate-900"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
        <div>
          <p className="font-semibold">{profile?.full_name ?? "Pengguna"}</p>
          <p className="text-sm text-[var(--muted)]">{profile?.email}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--border)] p-6">
        <h2 className="font-semibold">Informasi Profil</h2>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted)]">Nama Lengkap</label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted)]">Nomor Telepon</label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+62..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted)]">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-purple"
          >
            <option value="">Pilih gender</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted)]">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-purple"
            placeholder="Ceritakan tentang diri Anda..."
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button variant="outline" onClick={() => setPasswordModal(true)}>
            Ubah Kata Sandi
          </Button>
        </div>
      </div>

      <Modal
        open={passwordModal}
        onClose={() => setPasswordModal(false)}
        title="Ubah Kata Sandi"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)]">Password Baru</label>
            <Input
              type="password"
              value={passwordForm.new}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)]">Konfirmasi Password</label>
            <Input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
            />
          </div>
          <Button onClick={handleChangePassword} className="w-full">
            Simpan Perubahan
          </Button>
        </div>
      </Modal>
    </div>
  );
}