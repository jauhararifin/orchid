import React, { useEffect, useState } from 'react'
import { H1 } from '@blueprintjs/core'
import { NewTxForm } from './form'
import moment from 'moment'
import Noty from 'noty'
import { Formik } from 'formik'

export interface NewTxProps {
  name?: string
  timestamp?: number
  value?: number
  currency?: string
  channelSource?: string
  channelDestination?: string
  category?: string
}

const NewTX: React.FC<NewTxProps> = ({
  name,
  timestamp,
  value,
  currency,
  channelSource,
  channelDestination,
  category
}) => {
  const [currTs, setCurrTs] = useState<number>(0)
  useEffect(() => setCurrTs(moment().unix()), [])

  return (
    <div style={{ marginTop: 15 }}>
      <H1>New Transaction</H1>

      <Formik
        initialValues={{
          name: name || '',
          timestamp: timestamp || currTs,
          value: value || 0,
          currency: currency || 'SGD',
          channelSource: channelSource || 'Cash',
          channelDestination: channelDestination || 'Expense',
          category: category || 'Transportation'
        }}
        enableReinitialize={true}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const newTx = [
            {
              name: values.name,
              timestamp: values.timestamp,
              value: values.value,
              currency: values.currency,
              category: values.category,
              channel_source: values.channelSource,
              channel_destination: values.channelDestination,
              description: values.description
            }
          ]
          try {
            const response = await fetch('https://orchid-forest.herokuapp.com/api/v0/create-transactions', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTx)
            })
            const json = await response.json()
            const tx = json[0]

            new Noty({ text: `New transaction Added: ${tx.id}`, layout: 'bottomCenter', type: 'success' }).show()
            resetForm()
          } catch (e) {
            new Noty({ text: `Error adding transaction: ${e}`, layout: 'bottomCenter', type: 'alert' }).show()
          }
          setSubmitting(false)
        }}
        component={NewTxForm}
      />
    </div>
  )
}

export default NewTX
