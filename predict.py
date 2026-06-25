import os
import sys
import json
import joblib
import numpy as np

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

FEATURE_LABELS = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest Pain Type",
    "trestbps": "Resting Blood Pressure",
    "chol": "Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting ECG",
    "thalach": "Max Heart Rate",
    "exang": "Exercise Induced Angina",
    "oldpeak": "ST Depression (oldpeak)",
    "slope": "ST Slope",
    "ca": "Major Vessels (Fluoroscopy)",
    "thal": "Thalassemia"
}

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

_model = None
_scaler = None


def load_artifacts():
    global _model, _scaler
    if _model is None or _scaler is None:
        model_path = os.path.join(MODEL_DIR, "rf_model.pkl")
        scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            raise FileNotFoundError(
                "Trained model not found. Run train_model.py first."
            )

        _model = joblib.load(model_path)
        _scaler = joblib.load(scaler_path)

    return _model, _scaler


def get_status(feature: str, value: float) -> str:
    """Returns 'normal' | 'watch' | 'high' for simple clinical flagging."""
    if feature == "trestbps":
        if value >= 140:
            return "high"
        if value >= 120:
            return "watch"
        return "normal"
    if feature == "chol":
        if value >= 240:
            return "high"
        if value >= 200:
            return "watch"
        return "normal"
    if feature == "fbs":
        return "watch" if value == 1 else "normal"
    if feature == "restecg":
        return "watch" if value != 0 else "normal"
    if feature == "thalach":
        return "watch" if value < 100 else "normal"
    if feature == "exang":
        return "high" if value == 1 else "normal"
    if feature == "oldpeak":
        if value >= 2:
            return "high"
        if value >= 1:
            return "watch"
        return "normal"
    if feature == "slope":
        return {0: "normal", 1: "watch", 2: "high"}.get(int(value), "normal")
    if feature == "ca":
        if value >= 2:
            return "high"
        if value >= 1:
            return "watch"
        return "normal"
    if feature == "thal":
        return {0: "normal", 1: "watch", 2: "high"}.get(int(value), "normal")
    if feature == "cp":
        return "high" if value == 0 else "normal"
    return "normal"


def predict(input_data: dict) -> dict:
    model, scaler = load_artifacts()

    row = []
    for feature in FEATURES:
        if feature not in input_data or input_data[feature] is None:
            raise ValueError(f"Missing required feature: {feature}")
        row.append(float(input_data[feature]))

    X = np.array([row])
    X_scaled = scaler.transform(X)

    probability = model.predict_proba(X_scaled)[0][1]
    risk_percentage = round(float(probability) * 100, 2)

    if risk_percentage < 30:
        risk_level = "Low"
    elif risk_percentage < 65:
        risk_level = "Medium"
    else:
        risk_level = "High"

    importances = model.feature_importances_
    feature_importance = []
    for i, feature in enumerate(FEATURES):
        feature_importance.append({
            "feature": feature,
            "label": FEATURE_LABELS.get(feature, feature),
            "importance": round(float(importances[i]) * 100, 1),
            "value": row[i],
            "status": get_status(feature, row[i])
        })
    feature_importance.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "risk_percentage": risk_percentage,
        "risk_level": risk_level,
        "feature_importance": feature_importance
    }


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw_input = sys.argv[1]
    else:
        raw_input = sys.stdin.read()

    input_json = json.loads(raw_input)
    result = predict(input_json)
    print(json.dumps(result, indent=2))
