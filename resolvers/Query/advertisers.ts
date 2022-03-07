const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchAdvertisers() {
  // This third party service is really slow
  await sleep(3000)
  return [
    "Acme Corp",
    "Gringotts Bank",
    "Wonka Industries"
  ]
}

const advertisers = async () => {
  const advertisers = await fetchAdvertisers()
  return advertisers
}

export default advertisers
