import React, { useState } from 'react'
import NewTransaction from './newtx'
import Noty from 'noty'
import FrequentTxs from './freqtx'

const App: React.FC = () => {
  const [initialTx, setInitialTx] = useState({})
  const onSubmitSuccess = (txId: number) => {
    new Noty({ text: `New transaction Added: ${txId}`, layout: 'bottomCenter', type: 'success' }).show()
    setInitialTx({})
  }
  const onSubmitFailed = (ex: any) =>
    new Noty({ text: `Error adding transaction: ${ex}`, layout: 'bottomCenter', type: 'alert' }).show()
  return (
    <div style={{ margin: '10px 10px' }}>
      <NewTransaction {...initialTx} onSubmitSuccess={onSubmitSuccess} onSubmitFailed={onSubmitFailed} />
      <FrequentTxs onTxChoose={setInitialTx} />
    </div>
  )
}

export default App
