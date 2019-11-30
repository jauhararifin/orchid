import React from 'react'
import { Typography, Chip, Paper } from '@material-ui/core'
import { ArrowRightAlt } from '@material-ui/icons'

export interface Transaction {
  name: string
  value: number
  currency: string
  channelSource: string
  channelDestination: string
  category: string
}

export interface TransactionTemplatesProps {
  transactions: Transaction[]
  onTxChoose: (tx: Transaction) => void
}

interface TxTemplateProps {
  tx: Transaction
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const TxTemplate: React.FC<TxTemplateProps> = ({ tx, onClick }) => (
  <Paper style={{ padding: 10, marginTop: 10, border: '1px solid #c0c0c0' }} onClick={onClick} elevation={0}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Chip size="small" style={{ marginRight: 10 }} label={tx.category} />
      <Typography variant="h6">{tx.name}</Typography>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <Typography variant="subtitle2">{tx.value}</Typography>
      </div>
      <Chip size="small" style={{ marginLeft: 10 }} color="primary" label={tx.currency} />
      <Chip size="small" style={{ marginLeft: 10 }} label={tx.channelSource} />
      <ArrowRightAlt style={{ marginRight: 10, marginLeft: 10 }} />
      <Chip size="small" label={tx.channelDestination} />
    </div>
  </Paper>
)

export const TransactionTemplates: React.FC<TransactionTemplatesProps> = ({ transactions, onTxChoose }) => (
  <div style={{ padding: '10x 0' }}>
    {transactions.map((tx, i) => (
      <TxTemplate onClick={() => onTxChoose(tx)} key={i} tx={tx} />
    ))}
  </div>
)
