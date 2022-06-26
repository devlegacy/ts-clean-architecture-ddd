/// <reference types="../../../../../../types"/>

import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber'
import assert from 'assert'
import request from 'supertest'

import { MoocBackendApp } from '@/apps/mooc/backend/mooc-backend-app'

let _request: request.Test
let _response: request.Response
let application: MoocBackendApp

Given('I send a GET request to {string}', (route: string) => {
  _request = request(application.httpServer).get(route)
})

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status)
})

Given('I send a PUT request to {string} with body:', (route: string, body: string) => {
  _request = request(application.httpServer).put(route).send(JSON.parse(body))
})

Then('the response should be empty', () => {
  assert.deepStrictEqual(_response.body, {})
})

BeforeAll(
  {
    timeout: 2 * 5000
  },
  async () => {
    application = new MoocBackendApp()

    await application.start()
  }
)

AfterAll(() => {
  application.stop()
  setTimeout(() => {
    process.exit(0)
  }, 0)
})
