import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
