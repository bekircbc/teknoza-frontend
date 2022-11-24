import { Alert } from 'react-bootstrap'
import './messageBox.scss'

const MessageBox = (props) => {
    return (
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    )
}

export default MessageBox