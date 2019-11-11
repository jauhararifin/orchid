import React, { useState } from 'react'
import NewTransaction from './newtx'
import FrequentTxs from './freqtx'

const App: React.FC = () => {
  const [initialTx, setInitialTx] = useState({})
  return (
    <div style={{ margin: '10px 10px' }}>
      <NewTransaction {...initialTx} />
      <FrequentTxs onTxChoose={setInitialTx} />
    </div>
  )
}

export default App
