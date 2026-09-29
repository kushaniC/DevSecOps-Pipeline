import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import type { Express } from 'express'
import { createTestApp } from './helpers/setup'
import { login } from './helpers/auth'
import fs from 'node:fs'
import path from 'node:path'

let app: Express

before(
  async () => {
    const result = await createTestApp()
    app = result.app
  },
  { timeout: 60000 }
)

void describe('Security Regression Tests', () => {
  void describe('FTP Directory Listing Protection', () => {
    void it('should block access to the FTP directory listing', async () => {
      const res = await request(app).get('/ftp')

      assert.equal(res.status, 403)
    })
  })

  void describe('Basket IDOR Protection', () => {
    void it('should block access to another user’s basket', async () => {
      const { token } = await login(app, {
        email: 'bjoern.kimminich@gmail.com',
        password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI='
      })

      const res = await request(app)
        .get('/rest/basket/2')
        .set({ Authorization: 'Bearer ' + token })

      assert.equal(res.status, 403)
      assert.ok(res.body.error.includes('Forbidden'))
    })
  })

  void describe('JWT Sensitive Information Protection', () => {
    void it('should not expose password or ORM data in the JWT payload', async () => {
      const { token } = await login(app, {
        email: 'jim@juice-sh.op',
        password: 'ncc-1701'
      })

      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString()
      )

      assert.equal(payload.data.email, 'jim@juice-sh.op')
      assert.equal(payload.data.role, 'customer')

      assert.equal(payload.data.password, undefined)
      assert.equal(payload.data.passwordHash, undefined)
      assert.equal(payload.data.dataValues, undefined)
    })
  })

  void describe('RSA Private Key Secret Management', () => {
    void it('should not contain a hardcoded RSA private key in insecurity.ts', () => {
      const insecurityPath = path.resolve('lib/insecurity.ts')
      const source = fs.readFileSync(insecurityPath, 'utf8')

      assert.equal(
        source.includes('-----BEGIN RSA PRIVATE KEY-----'),
        false
      )

      assert.equal(
        source.includes('process.env.JWT_PRIVATE_KEY'),
        true
      )
    })
  })
})