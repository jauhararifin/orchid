import React, { useEffect, useState } from 'react'
import { H1 } from '@blueprintjs/core'
import { NewTxForm } from './form'
import moment from 'moment'
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
          const newTx = {
            ...values,
            channel_source: values.channelSource,
            channel_destination: values.channelDestination
          }
          try {
            const response = await fetch('https://orchid-forest.herokuapp.com/api/v0/create-transaction', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTx)
            })
            const json = await response.json()
            alert(`New Transaction Added: ${json.id}`)
            resetForm()
          } catch (e) {
            alert(`Got Error: ${e}`)
          }
          setSubmitting(false)
        }}
        component={NewTxForm}
      />
    </div>
  )
}

export default NewTX
