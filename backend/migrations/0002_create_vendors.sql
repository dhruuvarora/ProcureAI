CREATE TABLE vendors (
    vendor_id BIGSERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_organization VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255) UNIQUE NOT NULL,
    vendor_phone VARCHAR(20),
    category_id BIGINT REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
