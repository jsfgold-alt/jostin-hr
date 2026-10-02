-- ==============================================================================
-- DATABASE SCHEMA: Daftar Pegawai Sukses Group (MVP)
-- DBMS: PostgreSQL (Aiven Cloud) / Compatible with MySQL
-- ==============================================================================

-- 1. Membuat Tipe ENUM untuk PostgreSQL
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('hrd', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pegawai_status AS ENUM ('aktif', 'tidak_aktif');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Fungsi Trigger untuk updated_at Otomatis di PostgreSQL
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Membuat tabel Pengguna (Users) untuk kebutuhan Autentikasi & RBAC
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Simpan hashed password (misal: bcrypt)
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger auto-update timestamp untuk users
DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;
CREATE TRIGGER trigger_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Membuat tabel Pegawai (Direktori Karyawan)
CREATE TABLE IF NOT EXISTS pegawai (
    id SERIAL PRIMARY KEY,
    id_pegawai VARCHAR(50) UNIQUE NOT NULL, -- Contoh: PEG-0012
    nama_lengkap VARCHAR(150) NOT NULL,
    perusahaan VARCHAR(100) NOT NULL,
    divisi VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    tanggal_masuk DATE NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL,
    status pegawai_status DEFAULT 'aktif', -- Mendukung fitur Soft Delete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger auto-update timestamp untuk pegawai
DROP TRIGGER IF EXISTS trigger_update_pegawai_updated_at ON pegawai;
CREATE TRIGGER trigger_update_pegawai_updated_at
BEFORE UPDATE ON pegawai
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- DUMMY DATA / SEEDER (Untuk Kebutuhan Testing MVP)
-- ==============================================================================

-- Insert Dummy Users
-- Catatan: Password sebenarnya harus di-hash (contoh ini hanya representasi)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin HRD', 'hrd@suksesgroup.com', '$2y$10$ContohHashPasswordYangAman123', 'hrd'),
('Bapak Owner', 'owner@suksesgroup.com', '$2y$10$ContohHashPasswordYangAman456', 'owner')
ON CONFLICT (email) DO NOTHING;

-- Insert Dummy Pegawai
INSERT INTO pegawai (id_pegawai, nama_lengkap, perusahaan, divisi, jabatan, tanggal_masuk, nomor_hp, status) VALUES
('PEG-0001', 'Budi Santoso', 'PT Sukses Makmur', 'Operasional', 'Supervisor', '2023-01-15', '081234567890', 'aktif'),
('PEG-0002', 'Siti Rahma', 'PT Sukses Logistik', 'Keuangan', 'Staff Accounting', '2024-03-01', '081987654321', 'aktif'),
('PEG-0003', 'Agus Prayitno', 'CV Sukses Mandiri', 'Gudang', 'Kepala Gudang', '2022-05-10', '085612341234', 'aktif'),
('PEG-0004', 'Diana Putri', 'PT Sukses Makmur', 'Marketing', 'Digital Marketer', '2025-08-20', '082199887766', 'aktif'),
('PEG-0005', 'Reza Rahadian', 'PT Sukses Logistik', 'Operasional', 'Kurir Utama', '2023-11-11', '081122334455', 'tidak_aktif')
ON CONFLICT (id_pegawai) DO NOTHING;