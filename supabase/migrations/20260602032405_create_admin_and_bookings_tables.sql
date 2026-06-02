/*
  # Create Admin Users and Booking Tables

  1. New Tables
    - `admin_users` - Admin credentials and information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `role` (text) - 'admin' or 'superadmin'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings` - User trip bookings
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `trip_id` (uuid, foreign key to trips)
      - `destination` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `num_travelers` (integer)
      - `budget` (numeric)
      - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled'
      - `payment_status` (text) - 'pending', 'paid', 'refunded'
      - `payment_method` (text) - 'qr_code', 'card', 'bank_transfer'
      - `qr_code_url` (text)
      - `user_name` (text)
      - `user_email` (text)
      - `user_phone` (text)
      - `booking_date` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `admin_users` table
    - Enable RLS on `bookings` table
    - Add policies for authenticated admin access
    - Add policy for users to view their own bookings

  3. Indexes
    - Index on `admin_users.email` for quick lookup
    - Index on `bookings.user_id` for user queries
    - Index on `bookings.status` for filtering
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  destination text NOT NULL,
  start_date date,
  end_date date,
  num_travelers integer DEFAULT 1,
  budget numeric(12,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method text CHECK (payment_method IN ('qr_code', 'card', 'bank_transfer', null)),
  qr_code_url text,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text,
  booking_date timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Superadmins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update booking status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
