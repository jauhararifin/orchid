import React, { useEffect, useState } from 'react'
import { TransactionTemplates, Transaction } from './transactions'
import { Typography } from '@material-ui/core'

export interface FrequentTxsProps {
  onTxChoose: (tx: Transaction) => void
}

const FrequentTxs: React.FC<FrequentTxsProps> = ({ onTxChoose }) => {
  const [txs, setTxs] = useState<Transaction[]>([])
  useEffect(() => {
    ;(async () => {
      const resp = await fetch('https://orchid-forest.herokuapp.com/api/v0/get-frequent-transactions')
      const json = await resp.json()
      const txs = json.map((tx: any) => ({
        ...tx,
        channelSource: tx['channel_source'],
        channelDestination: tx['channel_destination']
      }))
      setTxs(txs)
    })()
  }, [])

  return (
    <div style={{ marginTop: 15 }}>
      <Typography variant="h3">Frequent Transactions</Typography>
      <TransactionTemplates onTxChoose={onTxChoose} transactions={txs} />
    </div>
  )
}

export default FrequentTxs
