import _ from 'lodash'
import Resource from './Resource'
import { jsonApiResource } from './default.config'

export default class JsonApiResource extends Resource {
 	constructor(resourceConfig) {
  	super(resourceConfig, jsonApiResource)
 	}
}