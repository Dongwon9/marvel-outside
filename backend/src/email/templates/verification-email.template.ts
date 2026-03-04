export function buildVerificationEmailHtml(verifyUrl: string): string {
  return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>이메일 인증</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#2563eb;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Marvel Outside</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">이메일 인증을 완료해주세요</h2>
                    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                      Marvel Outside에 가입해 주셔서 감사합니다.<br />
                      아래 버튼을 클릭하면 이메일 인증이 완료됩니다.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:8px;background:#2563eb;">
                          <a href="${verifyUrl}"
                             style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                            이메일 인증하기
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;line-height:1.5;">
                      이 링크는 <strong>24시간</strong> 동안 유효합니다.<br />
                      본인이 요청하지 않은 경우 이 이메일을 무시하세요.
                    </p>
                    <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
                    <p style="margin:0;color:#9ca3af;font-size:12px;">
                      링크가 작동하지 않으면 아래 주소를 브라우저에 직접 입력하세요:<br />
                      <a href="${verifyUrl}" style="color:#2563eb;word-break:break-all;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
}
