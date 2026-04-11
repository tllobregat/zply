export const DEFAULT_SQL: string = `-- Zply DB Visualizer - Feature Showcase
-- Support for: PK/FK, Composite Keys, Unique, Not Null, and Defaults

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    workspace_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    CONSTRAINT fk_workspace 
        FOREIGN KEY (workspace_id) 
        REFERENCES workspaces(id) 
        ON DELETE CASCADE
);

-- Showcase: Composite Primary Key (Badge will appear)
CREATE TABLE project_members (
    project_id INT REFERENCES projects(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- Showcase: Independent ALTER TABLE support
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    target_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT
);

`;
