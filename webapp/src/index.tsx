import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import 'normalize.css'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
