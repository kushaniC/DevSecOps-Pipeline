import request from 'supertest'
import app from '../../app'

void describe('Security Regression Tests', () => {
  void describe('FTP Directory Listing Protection', () => {
    void it('should block access to the FTP directory listing', async () => {
      const res = await request(app).get('/ftp')

      assert.equal(res.status, 403)
    })
  })
})