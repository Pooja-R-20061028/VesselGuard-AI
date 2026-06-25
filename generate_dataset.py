import os
import numpy as np
import pandas as pd

np.random.seed(42)

N = 1000

age = np.random.randint(29, 80, N)
sex = np.random.randint(0, 2, N)
cp = np.random.randint(0, 4, N)
trestbps = np.random.randint(94, 200, N)
chol = np.random.randint(126, 564, N)
fbs = np.random.binomial(1, 0.15, N)
restecg = np.random.randint(0, 3, N)
thalach = np.random.randint(71, 202, N)
exang = np.random.binomial(1, 0.3, N)
oldpeak = np.round(np.random.uniform(0, 6.2, N), 1)
slope = np.random.randint(0, 3, N)
ca = np.random.randint(0, 4, N)
thal = np.random.randint(0, 3, N)

risk_score = (
    (age - 29) / 50 * 0.20 +
    sex * 0.08 +
    (cp == 0).astype(float) * 0.15 +
    (trestbps - 94) / 106 * 0.10 +
    (chol - 126) / 438 * 0.10 +
    fbs * 0.05 +
    exang * 0.15 +
    (1 - (thalach - 71) / 131) * 0.20 +
    (oldpeak / 6.2) * 0.15 +
    (ca / 3) * 0.15 +
    (thal == 2).astype(float) * 0.10
)

risk_score = (risk_score - risk_score.min()) / (risk_score.max() - risk_score.min())
noise = np.random.normal(0, 0.08, N)
risk_score = np.clip(risk_score + noise, 0, 1)

target = (risk_score > 0.5).astype(int)

df = pd.DataFrame({
    "age": age,
    "sex": sex,
    "cp": cp,
    "trestbps": trestbps,
    "chol": chol,
    "fbs": fbs,
    "restecg": restecg,
    "thalach": thalach,
    "exang": exang,
    "oldpeak": oldpeak,
    "slope": slope,
    "ca": ca,
    "thal": thal,
    "target": target
})

out_dir = os.path.join(os.path.dirname(__file__), "dataset")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "heart.csv")
df.to_csv(out_path, index=False)

print("Dataset generated at:", out_path)
print("Shape:", df.shape)
print(df["target"].value_counts())
