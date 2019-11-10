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
        onSubmit={(values, { setSubmitting }) => {
          console.log(values)
          setSubmitting(false)
        }}
        component={NewTxForm}
      />
    </div>
  )
}

export default NewTX
