const Base = require('../../base')
const { cli } = require('cli-ux')
const { getTransaction, getReceipt } = require('../../helpers/getTransactionObject')
const { getNetworkFlags } = require('../../helpers/networks')

class GetCommand extends Base {
  async run() {
    const { args, flags } = this.parse(GetCommand)
    let networkUrl

    try {
      networkUrl = this.getNetworkUrl(flags)

      const { txHash } = args
      const promises = [getTransaction(txHash, networkUrl), getReceipt(txHash, networkUrl)]
      const [transaction, receipt] = await Promise.all(promises)

      if (transaction) {
        transaction.receipt = receipt
      }
      cli.styledJSON(transaction)
    } catch (e) {
      this.error(e.message, { exit: 1 })
    }
  }
}

GetCommand.aliases = ['tx:get']

GetCommand.description = `Print the transaction object for the given transaction hash.`

GetCommand.args = [
  {
    name: 'txHash',
    required: true,
    description: 'The transaction hash.'
  }
]

GetCommand.flags = getNetworkFlags()

GetCommand.examples = [
  'eth transaction:get --mainnet 0xc83836f1b3acac94a31de8e24c913aceaa9ebc51c93cd374429590596091584a',
  'eth transaction:get --ropsten 0xc83836f1b3acac94a31de8e24c913aceaa9ebc51c93cd374429590596091584a',
  'eth transaction:get --url= http://localhost:8545 0xc83836f1b3acac94a31de8e24c913aceaa9ebc51c93cd374429590596091584a'
]

module.exports = GetCommand