import React from 'react'
import { Card, H5, Divider, Icon, Tag, Intent } from '@blueprintjs/core'

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
  <Card style={{ padding: 10, marginTop: 10 }} interactive={true} onClick={onClick}>
    <H5>
      <Tag style={{ marginRight: 10 }} minimal={true}>
        {tx.category}
      </Tag>
      {tx.name}
    </H5>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <strong>{tx.value}</strong>
      </div>
      <Tag style={{ marginLeft: 10 }} intent={Intent.SUCCESS}>
        {tx.currency}
      </Tag>
      <Divider />
      <Tag>{tx.channelSource}</Tag>
      <Icon style={{ marginRight: 10, marginLeft: 10 }} icon="arrow-right" />
      <Tag>{tx.channelDestination}</Tag>
    </div>
  </Card>
)

export const TransactionTemplates: React.FC<TransactionTemplatesProps> = ({ transactions, onTxChoose }) => (
  <div style={{ padding: '10x 0' }}>
    {transactions.map((tx, i) => (
      <TxTemplate onClick={() => onTxChoose(tx)} key={i} tx={tx} />
    ))}
  </div>
)
