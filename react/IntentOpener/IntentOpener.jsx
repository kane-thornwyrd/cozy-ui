import React from 'react'
import Modal from '../Modal'
import IntentIframe from './IntentIframe'
import styles from './styles.styl'
import PropTypes from 'prop-types'

/**
 * Wrapper that adds an `onClick` handler to its children that opens a modal
 * for the specified intent.
 *
 * The modal for an intent takes the majority of the viewport.
 */
class IntentOpener extends React.Component {
  state = {
    modalOpened: false
  }

  openModal = () => {
    this.setState({
      modalOpened: true
    })
  }

  closeModal = () => {
    this.setState({
      modalOpened: false
    })
  }

  handleComplete = result => {
    this.closeModal()
    if (this.props.onComplete) {
      this.props.onComplete(result)
    }
  }

  handleDismiss = () => {
    this.closeModal()
    if (this.props.onDismiss) {
      this.props.onDismiss()
    }
  }

  render () {
    const { options, action, doctype, children, closable, create, tag } = this.props
    const { modalOpened } = this.state

    const Tag = tag // React needs uppercase element names

    const elements = [
      React.cloneElement(children, { key: 'opener', onClick: this.openModal })
    ]

    if (modalOpened) {
      elements.push(
        <Modal
            key='modal'
            closable={closable}
            overflowHidden
            className={styles.intentModal}
            crossClassName={styles.intentModal__cross}
            dismissAction={this.handleDismiss}>
          <IntentIframe
            action={action}
            doctype={doctype}
            options={options}
            onComplete={this.handleComplete}
            create={create}
          />
        </Modal>
      )
    }


    return <Tag>{ elements }</Tag>
  }
}

IntentOpener.propTypes = {
  children: PropTypes.element.isRequired
}

IntentOpener.defaultProps = {
  tag: 'span',
  closable: true,
}

export default IntentOpener
