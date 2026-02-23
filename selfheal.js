class SelfHeal {
    constructor(serverUrl, apiKey) {
        this.serverUrl = serverUrl;
        this.apiKey = apiKey;
    }

    init(repo, filePath) {
        const handleError = async (errorMsg, stack) => {
            try {
                if (typeof fetch === 'undefined') {
                    // Node 16/17 compatibility if fetch not present, but Node 18+ has fetch.
                    console.error("SelfHeal: native fetch not available.");
                    return;
                }
                await fetch(this.serverUrl + "/report", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        repo: repo,
                        file_path: filePath,
                        error: errorMsg,
                        trace: stack
                    })
                });
            } catch (err) {
                console.error("SelfHeal: Failed to send crash report", err);
            }
        };

        process.on('uncaughtException', (err) => {
            handleError(err.message, err.stack);
        });
        process.on('unhandledRejection', (reason, promise) => {
            handleError(reason?.message || 'Unhandled Rejection', reason?.stack);
        });
    }
}
module.exports = SelfHeal;
