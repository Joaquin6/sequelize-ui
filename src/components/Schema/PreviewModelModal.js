import React from 'react'
import { withMedia } from 'react-media-query-hoc'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Modal, Button, Icon, Table } from 'semantic-ui-react'

/* ----------  CONSTANTS  ---------- */
import {
  displayRelationship,
  displayOption,
  displayMethod
} from '../../constants'

const checkIf = condition => condition
  ? <Icon color='green' name='checkmark' size='large' /> : null

const viewMethods = methods => {
  const methodDisplays =
      Object.keys(methods).filter(method => methods[method]).map(displayMethod)

  return methodDisplays.length
    ? <p>{`Method Templates: ${methodDisplays.join(', ')}`}</p>
    : null
}

const viewOptions = config => {
  const optionDisplays =
    Object.keys(config)
      .filter(option => config[option])
      .map(option =>
        typeof config[option] === 'boolean'
          ? displayOption(option)
          : `${displayOption(option)}: ${config[option]}`
      )

  return optionDisplays.length
    ? <p>{`Options: ${optionDisplays.join(', ')}`}</p>
    : null
}

const viewAssociations = (associations, modelNamesById) => (
  associations.length
    ? (
      <React.Fragment>
        <p>Associations</p>
        <ul>
          {associations.map(({ id, target, relationship }) =>
            <li key={id}>
              {displayRelationship(relationship)} {modelNamesById[target]}
            </li>
          )}
        </ul>
      </React.Fragment>
    )
    : null
)

const viewFields = (fields, media) => {
  return (
    media.smallScreen
      ? <React.Fragment>
        {fields.map((field, idx) => (
          <Table
            attached
            celled
            structured
            unstackable
            textAlign='center'
            key={field.id}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>{field.name}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Data Type</Table.Cell>
                <Table.Cell>{field.type}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Primary Key</Table.Cell>
                <Table.Cell>{checkIf(field.primaryKey)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Unique Key</Table.Cell>
                <Table.Cell>{checkIf(field.unique)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Not Null</Table.Cell>
                <Table.Cell>{checkIf(!field.allowNull)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Default Value</Table.Cell>
                <Table.Cell>{field.default}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Auto Increment</Table.Cell>
                <Table.Cell>{checkIf(field.autoIncrement)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ))}
      </React.Fragment>
      : <Table celled unstackable compact textAlign='center' size='large'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Field</Table.HeaderCell>
            <Table.HeaderCell>Data Type</Table.HeaderCell>
            <Table.HeaderCell>Primary Key</Table.HeaderCell>
            <Table.HeaderCell>Unique Key</Table.HeaderCell>
            <Table.HeaderCell>Not Null</Table.HeaderCell>
            <Table.HeaderCell>Default Value</Table.HeaderCell>
            <Table.HeaderCell>Auto Increment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map(field => (
            <Table.Row key={field.id}>
              <Table.Cell>{field.name}</Table.Cell>
              <Table.Cell>{field.type}</Table.Cell>
              <Table.Cell>{checkIf(field.primaryKey)}</Table.Cell>
              <Table.Cell>{checkIf(field.unique)}</Table.Cell>
              <Table.Cell>{checkIf(!field.allowNull)}</Table.Cell>
              <Table.Cell>{field.default}</Table.Cell>
              <Table.Cell>{checkIf(field.autoIncrement)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
  )
}

class PreviewModelModal extends React.Component {
  static handleTab = (evt, otherClass) => {
    if (evt.key === 'Tab') {
      evt.preventDefault()
      document.querySelector(otherClass).focus()
    }
  }

  render () {
    const { model, close, edit, media, modelNamesById } = this.props
    return (
      <Modal
        closeOnDimmerClick
        open={Boolean(model)}
        onClose={close}
        size='large'
        className='preview-modal'
      >
        {model &&
        <React.Fragment>
          <Modal.Header>
            {model.name}
            <Button
              className='close-btn'
              icon='cancel'
              onClick={close}
              onKeyDown={evt => PreviewModelModal.handleTab(evt, '.edit-btn')}
            />
            <Button
              className='edit-btn'
              icon='edit'
              onClick={edit}
              onKeyDown={evt => PreviewModelModal.handleTab(evt, '.close-btn')}
            />
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {model.fields.length ? viewFields(model.fields, media) : null}
              {viewMethods(model.methods)}
              {viewOptions(model.config)}
              {viewAssociations(model.associations, modelNamesById)}
            </Modal.Description>
          </Modal.Content>
        </React.Fragment>
        }
      </Modal>
    )
  }
}

export default withMedia(PreviewModelModal)