import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebService();

  async function waitForWebService() {
    return retry(checkStatusPage, {
      retries: 10,
      maxTimeout: 1000,
    });

    async function checkStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

const orchestrator = { waitForAllServices };
export default orchestrator;
