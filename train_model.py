import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]


def main():
    base_dir = os.path.dirname(__file__)
    dataset_path = os.path.join(base_dir, "dataset", "heart.csv")

    if not os.path.exists(dataset_path):
        raise FileNotFoundError(
            "dataset/heart.csv not found. Run generate_dataset.py first."
        )

    df = pd.read_csv(dataset_path)

    X = df[FEATURES]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=8,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test, y_pred))

    model_dir = os.path.join(base_dir, "model")
    os.makedirs(model_dir, exist_ok=True)

    joblib.dump(model, os.path.join(model_dir, "rf_model.pkl"))
    joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

    print("Model saved to:", os.path.join(model_dir, "rf_model.pkl"))
    print("Scaler saved to:", os.path.join(model_dir, "scaler.pkl"))


if __name__ == "__main__":
    main()
