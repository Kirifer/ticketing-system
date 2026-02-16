#  IT Squarehub Global Services Corporation - Ticketing System

A robust and scalable support ticket management system designed for **IT Squarehub Global Services Corporation**. This platform streamlines technical support requests, allowing for real-time tracking, prioritization, and resolution of company-wide issues.

---
## 🛠 Database Schema (PostgreSQL)

The system uses a relational structure to ensure data integrity and fast querying of ticket statuses.

### 1. Initial Table Creation
Run this query to create the core structure of the ticketing database:

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(20) UNIQUE NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Table Migrations & Updates
If you are updating an existing database, run these commands to add support for full names, categories, priorities, and attachments:

SQL
-- Add tracking and metadata columns
ALTER TABLE tickets 
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS category VARCHAR(50),
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20),
    ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add resolution tracking
ALTER TABLE tickets 
    ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;

****Prerequisites****
Node.js (v18+)
PostgreSQL (v14+)
Git

Installation & Setup
1.Clone the repository:
git clone [https://github.com/Kirifer/ticketing-system.git](https://github.com/Kirifer/ticketing-system.git)

2.Install dependencies:
npm install

3. Environment Variables:
Create a .env file in the root and add your database credentials:
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ticketing_db

4. Run the Application:
npm start
