import {CeramicClient} from '@ceramicnetwork/http-client'
import { onShutdown } from "node-graceful-shutdown";
import { ConfigService } from './config.service.js'
// import IPFSHTTP from 'ipfs-http-client'
import { CoreService } from './modules/core/core.service.js'
import {EncoderApiModule} from './api/index.js'

let instance: CoreService;
async function startup(): Promise<void> {
  
  try {
    // init ceramic
    const ceramic = new CeramicClient(ConfigService.getConfig().ceramicHost) //Using the public node for now.
  
  
    instance = new CoreService(ceramic)
    await instance.start()
  
    const api = new EncoderApiModule(4005, instance)
    await api.listen()
  } catch (ex) {
    console.log(ex.message)
    await instance.stop()
    process.exit(0)
  }

}

void startup()


process.on('unhandledRejection', (error: Error) => {
  console.log('unhandledRejection', error)
})


onShutdown(async () => {
  console.log('Video encoder stopping... ')
  await instance.stop()
  console.log('Exit');

});
