const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

const pathKey = path.resolve("service-account.json");
async function getData(id, data) {
    try {
        const db = new Firestore({
            projectId: "submissionmlgc-faizalhusaina",
            keyFilename: pathKey,
        });

        const predictCollection = db.collection("predictions");
        const result = await predictCollection.get();
        const data = [];
        result.forEach((doc) => {
            data.push(doc.data());
        });
        return data;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}

module.exports = getData;
