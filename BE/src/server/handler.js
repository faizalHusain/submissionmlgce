const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const getData = require("../services/getData");

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { result, confidenceScore, suggestion } = await predictClassification(
        model,
        image
    );
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id: id,
        result: result,
        suggestion,
        createdAt,
    };

    await storeData(id, data);

    const response = h.response({
        status: "success",
        message:
            confidenceScore > 99
                ? "Model is predicted successfully"
                : "Model is predicted successfully but under threshold. Please use the correct picture",
        data: data,
    });
    response.code(201);
    return response;
}
async function getPredictHistoryHandler(request, h) {
    const data = await getData();
    const result = data.map((item) => {
        return {
            id: item.id,
            history: {
                id: item.id,
                result: item.result,
                suggestion: item.suggestion,
                createdAt: item.createdAt,
            },
        };
    });
    return h.response({
        status: "success",
        data: result,
    });
}

module.exports = { postPredictHandler, getPredictHistoryHandler };
