const crypto = require('crypto')

function sign(data) {
    //  const convertJson = JSON.stringify(data);
    try{
      const secret = process.env.SIGN_SECRET;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(data);
      return hmac.digest('hex');
  } catch (error) {
      throw error
  }
  }

function attestation(req, res, next) {
    try {
        const signature = req.headers['x-webhook-signature'];

        if (!signature) {
            console.error('NO SIGNATURE');
            return res.status(400).json({ error: 'No signature provided' });
        }
        
        const payload = JSON.stringify(req.body);
        const generatedSignature = sign(payload);
       
        if (generatedSignature !== signature) {
            console.error('INVALID SIGNATURE');
            return res.status(403).json({ error: 'Invalid signature' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { sign, attestation }