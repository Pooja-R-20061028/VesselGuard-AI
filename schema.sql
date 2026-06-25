CREATE DATABASE IF NOT EXISTS vesselguard_db;
USE vesselguard_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INT,
    gender VARCHAR(20),
    contact VARCHAR(50),
    height DOUBLE,
    weight DOUBLE,
    bmi DOUBLE,
    cp INT,
    trestbps INT,
    chol INT,
    fbs INT,
    restecg INT,
    thalach INT,
    exang INT,
    oldpeak DOUBLE,
    slope INT,
    ca INT,
    thal INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    patient_name VARCHAR(150),
    feature_importance TEXT,
    risk_percentage DOUBLE NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_predictions_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_predictions_user FOREIGN KEY (user_id) REFERENCES users(id)
);
