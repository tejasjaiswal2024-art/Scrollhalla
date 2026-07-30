-- Database Schema Initialization for Scrollhalla

CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'TO_DO',
    moscow VARCHAR(50) DEFAULT 'SHOULD_HAVE',
    story_points INT DEFAULT 3,
    assignee VARCHAR(100) DEFAULT 'Unassigned',
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(50) PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Tasks
INSERT INTO tasks (id, title, description, status, moscow, story_points, assignee, views) VALUES
('TASK-101', 'Implement OAuth 2.0 User Authentication', 'Setup JWT authentication and secure session tokens for frontend client access.', 'IN_PROGRESS', 'MUST_HAVE', 5, 'Tejas Jaiswal', 42),
('TASK-102', 'Smart Backlog Engagement Algorithm', 'Design OOAD scoring engine evaluating views, comments, and backlog time.', 'IN_REVIEW', 'MUST_HAVE', 8, 'Tejas Jaiswal', 89),
('TASK-103', 'Sprint Risk Score Telemetry Ingestion', 'Fetch external GitHub RSS feeds and dynamically calculate deployment risk percentage.', 'TO_DO', 'SHOULD_HAVE', 5, 'Aarav Sharma', 28),
('TASK-104', 'Interactive Agile Kanban Board', 'Build responsive drag-and-drop Kanban view with MoSCoW prioritization tags.', 'IN_PROGRESS', 'MUST_HAVE', 8, 'Priya Patel', 64)
ON CONFLICT (id) DO NOTHING;
