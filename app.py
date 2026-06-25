from flask import Flask, request, jsonify
from predict import predict

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict_route():
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.get_json(force=True)
        result = predict(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "VesselGuard AI - ML Service"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
