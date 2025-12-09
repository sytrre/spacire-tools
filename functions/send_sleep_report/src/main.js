export default async ({ req, res, log, error }) => {
    try {
        const payload = JSON.parse(req.body);
        const { toolName, email, firstName } = payload;

        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
        const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mail.spacire.com';
        const MAILGUN_REGION = process.env.MAILGUN_REGION || 'EU';

        const baseUrl = MAILGUN_REGION === 'EU' 
            ? 'https://api.eu.mailgun.net/v3' 
            : 'https://api.mailgun.net/v3';

        let htmlContent, textContent, subject;

        // Route to appropriate email generator based on tool
        if (toolName === 'shift-worker-sleep-planner') {
            const result = generateShiftWorkerEmail(payload, firstName);
            htmlContent = result.html;
            textContent = result.text;
            subject = result.subject;
        } else {
            // Default: Sleep Environment Optimizer (existing behavior)
            const result = generateSleepEnvironmentEmail(payload, firstName);
            htmlContent = result.html;
            textContent = result.text;
            subject = result.subject;
        }

        // Send via Mailgun
        const formData = new URLSearchParams();
        formData.append('from', 'Spacire <noreply@mail.spacire.com>');
        formData.append('to', email);
        formData.append('subject', subject);
        formData.append('html', htmlContent);
        formData.append('text', textContent);

        const response = await fetch(`${baseUrl}/${MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        if (response.ok) {
            log(`Email sent successfully to ${email} for tool: ${toolName || 'sleep-environment-optimizer'}`);
            return res.json({ success: true, message: 'Email sent successfully' });
        } else {
            const errorText = await response.text();
            error(`Mailgun error: ${errorText}`);
            return res.json({ success: false, message: 'Failed to send email' });
        }

    } catch (err) {
        error(`Function error: ${err.message}`);
        return res.json({ success: false, message: err.message });
    }
};

// ============================================
// SLEEP ENVIRONMENT OPTIMIZER EMAIL (EXISTING)
// ============================================
function generateSleepEnvironmentEmail(payload, firstName) {
    const { overallScore, scores, recommendations } = payload;

    const getScoreRating = (score) => {
        if (score >= 85) return { label: 'Excellent', color: '#28a745' };
        if (score >= 70) return { label: 'Good', color: '#5cb85c' };
        if (score >= 55) return { label: 'Fair', color: '#f0ad4e' };
        if (score >= 40) return { label: 'Needs Improvement', color: '#ff9800' };
        return { label: 'Poor', color: '#d9534f' };
    };

    const getCategoryRating = (score) => {
        if (score >= 17) return { label: 'Excellent', color: '#28a745' };
        if (score >= 14) return { label: 'Good', color: '#5cb85c' };
        if (score >= 10) return { label: 'Fair', color: '#f0ad4e' };
        if (score >= 6) return { label: 'Needs Work', color: '#ff9800' };
        return { label: 'Poor', color: '#d9534f' };
    };

    const overallRating = getScoreRating(overallScore);

    let recommendationsHtml = '';
    if (recommendations && recommendations.length > 0) {
        recommendations.forEach((rec) => {
            const priorityColors = { high: '#dc3545', medium: '#fd7e14', low: '#28a745' };
            const priorityColor = priorityColors[rec.priority] || '#6c757d';

            let diyTipsHtml = '';
            if (rec.diyTips && rec.diyTips.length > 0) {
                diyTipsHtml = `
                    <div style="background: #f0f9f0; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0;">
                        <div style="font-weight: 600; color: #28a745; margin-bottom: 10px; font-size: 14px;">Free DIY Solutions:</div>
                        <ul style="margin: 0; padding-left: 20px; color: #333;">
                            ${rec.diyTips.map(tip => `<li style="margin-bottom: 8px; line-height: 1.5;">${tip}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            let productsHtml = '';
            if (rec.products && rec.products.length > 0) {
                productsHtml = `
                    <div style="background: #fff8e6; border-left: 4px solid #E0B252; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0;">
                        <div style="font-weight: 600; color: #996b00; margin-bottom: 10px; font-size: 14px;">Recommended Products:</div>
                        ${rec.products.map(product => `
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 10px; background: #fff; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 12px;">
                                        <div style="font-weight: 600; color: #042548;">${product.name}</div>
                                        <div style="color: #E0B252; font-weight: 600;">${product.price}</div>
                                    </td>
                                    <td style="padding: 12px; text-align: right;">
                                        <a href="${product.link}" style="background: #042548; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-block;">Shop Now</a>
                                    </td>
                                </tr>
                            </table>
                        `).join('')}
                    </div>
                `;
            }

            recommendationsHtml += `
                <div style="background: #fff; border: 1px solid #e6e6e6; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td><h3 style="margin: 0; color: #042548; font-size: 18px; font-weight: 600;">${rec.title}</h3></td>
                            <td style="text-align: right;"><span style="background: ${priorityColor}; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">${rec.priority} priority</span></td>
                        </tr>
                    </table>
                    <p style="color: #555; line-height: 1.6; margin: 12px 0 15px 0;">${rec.text}</p>
                    ${diyTipsHtml}
                    ${productsHtml}
                </div>
            `;
        });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Sleep Environment Report</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr><td align="center" style="padding: 20px 10px;">
            <table cellpadding="0" cellspacing="0" border="0" width="650" style="max-width: 650px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <tr><td style="background: linear-gradient(135deg, #042548 0%, #0a3a6b 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Sleep Environment Report</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">Personalized results from the Spacire Sleep Environment Optimizer</p>
                </td></tr>
                <tr><td style="padding: 40px 30px;">
                    <p style="font-size: 16px; color: #333; margin: 0 0 25px;">Hi ${firstName},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 30px;">Thank you for using the Spacire Sleep Environment Optimizer. Here's your complete personalized sleep report.</p>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #e6f4ff 0%, #f0f8ff 100%); border-radius: 16px; margin-bottom: 35px; border: 1px solid #cce5ff;">
                        <tr><td style="padding: 35px; text-align: center;">
                            <div style="font-size: 72px; font-weight: 700; color: #042548; line-height: 1;">${overallScore}<span style="font-size: 32px; color: #666;">/100</span></div>
                            <div style="color: #666; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">Overall Sleep Environment Score</div>
                            <div style="display: inline-block; background: ${overallRating.color}; color: #fff; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-top: 15px;">${overallRating.label}</div>
                        </td></tr>
                    </table>
                    <h2 style="color: #042548; font-size: 22px; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 3px solid #E0B252;">Category Breakdown</h2>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 35px;">
                        <tr style="background: #f8f9fa;"><td style="padding: 15px; border-bottom: 1px solid #e6e6e6;"><strong style="color: #042548;">&#127777; Temperature</strong></td><td style="padding: 15px; border-bottom: 1px solid #e6e6e6; text-align: right;"><span style="color: ${getCategoryRating(scores.temperature).color}; font-weight: 600;">${scores.temperature}/20</span></td></tr>
                        <tr><td style="padding: 15px; border-bottom: 1px solid #e6e6e6;"><strong style="color: #042548;">&#128161; Lighting</strong></td><td style="padding: 15px; border-bottom: 1px solid #e6e6e6; text-align: right;"><span style="color: ${getCategoryRating(scores.light).color}; font-weight: 600;">${scores.light}/20</span></td></tr>
                        <tr style="background: #f8f9fa;"><td style="padding: 15px; border-bottom: 1px solid #e6e6e6;"><strong style="color: #042548;">&#128266; Sound</strong></td><td style="padding: 15px; border-bottom: 1px solid #e6e6e6; text-align: right;"><span style="color: ${getCategoryRating(scores.sound).color}; font-weight: 600;">${scores.sound}/20</span></td></tr>
                        <tr><td style="padding: 15px; border-bottom: 1px solid #e6e6e6;"><strong style="color: #042548;">&#128167; Humidity</strong></td><td style="padding: 15px; border-bottom: 1px solid #e6e6e6; text-align: right;"><span style="color: ${getCategoryRating(scores.humidity).color}; font-weight: 600;">${scores.humidity}/20</span></td></tr>
                        <tr style="background: #f8f9fa;"><td style="padding: 15px;"><strong style="color: #042548;">&#128716; Bedding</strong></td><td style="padding: 15px; text-align: right;"><span style="color: ${getCategoryRating(scores.bedding).color}; font-weight: 600;">${scores.bedding}/20</span></td></tr>
                    </table>
                    <h2 style="color: #042548; font-size: 22px; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 3px solid #E0B252;">Your Personalized Recommendations</h2>
                    ${recommendationsHtml || '<p style="color: #28a745;">Your sleep environment is well-optimized!</p>'}
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-top: 30px;">
                        <h3 style="color: #042548; margin: 0 0 15px; font-size: 18px;">&#127775; Bonus: Quick Sleep Hygiene Tips</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                            <li>Maintain a consistent sleep schedule</li>
                            <li>Avoid screens 30 minutes before bed</li>
                            <li>Keep your bedroom for sleep only</li>
                            <li>Avoid caffeine after 2 PM</li>
                        </ul>
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 35px;">
                        <tr><td style="text-align: center;"><a href="https://spacire.com/collections/sleep-wellness-essentials" style="display: inline-block; background: #042548; color: #fff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600;">Browse Sleep Solutions</a></td></tr>
                    </table>
                </td></tr>
                <tr><td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e6e6e6;">
                    <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Sleep well,<br><strong style="color: #042548;">The Spacire Team</strong></p>
                    <p style="margin: 15px 0 0; color: #999; font-size: 12px;">&copy; 2025 Spacire</p>
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

    const text = `YOUR SLEEP ENVIRONMENT REPORT\n\nHi ${firstName},\n\nOVERALL SCORE: ${overallScore}/100 (${overallRating.label})\n\nCATEGORY BREAKDOWN:\n- Temperature: ${scores.temperature}/20\n- Lighting: ${scores.light}/20\n- Sound: ${scores.sound}/20\n- Humidity: ${scores.humidity}/20\n- Bedding: ${scores.bedding}/20\n\nVisit https://spacire.com for sleep solutions.\n\nThe Spacire Team`;

    return { html, text, subject: `Your Sleep Environment Score: ${overallScore}/100 - ${overallRating.label}` };
}

// ============================================
// SHIFT WORKER SLEEP PLANNER EMAIL (NEW)
// ============================================
function generateShiftWorkerEmail(payload, firstName) {
    const { shiftType, shiftStart, shiftEnd, schedule, tips, diyTips, products } = payload;

    const shiftNames = {
        'fixed-night': 'Night Shift',
        'fixed-early': 'Early Shift',
        'fixed-late': 'Evening Shift',
        'rotating': 'Rotating Shifts',
        'split': 'Split Shifts',
        'on-call': 'On-Call/Irregular'
    };
    const shiftLabel = shiftNames[shiftType] || 'Shift Work';

    let scheduleHtml = '';
    if (schedule && schedule.length > 0) {
        schedule.forEach(item => {
            scheduleHtml += `<tr><td style="padding: 12px; border-bottom: 1px solid #e6e6e6; width: 100px; vertical-align: top;"><span style="background: #042548; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">${item.time}</span></td><td style="padding: 12px; border-bottom: 1px solid #e6e6e6;"><div style="font-weight: 600; color: #042548; margin-bottom: 4px;">${item.title}</div><div style="font-size: 14px; color: #666;">${item.desc}</div></td></tr>`;
        });
    }

    let tipsHtml = '';
    if (tips && tips.length > 0) {
        tips.forEach(tip => {
            tipsHtml += `<div style="background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid #E0B252;"><div style="font-weight: bold; color: #042548; margin-bottom: 8px;">${tip.title}</div><p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5;">${tip.text}</p></div>`;
        });
    }

    let diyHtml = '';
    if (diyTips && diyTips.length > 0) {
        diyTips.forEach(section => {
            diyHtml += `<div style="margin-bottom: 20px;"><h4 style="color: #042548; margin: 0 0 10px; font-size: 15px;">${section.title}</h4><ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px;">${section.tips.map(tip => `<li style="margin-bottom: 6px;">${tip}</li>`).join('')}</ul></div>`;
        });
    }

    let productsHtml = '';
    if (products && products.length > 0) {
        products.forEach(product => {
            productsHtml += `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px; background: #fff; border-radius: 8px; border: 1px solid #e6e6e6;"><tr><td style="padding: 12px;"><div style="font-size: 11px; color: #E0B252; text-transform: uppercase; margin-bottom: 4px;">${product.category}</div><div style="font-weight: 600; color: #042548; margin-bottom: 4px;">${product.name}</div><div style="font-weight: bold; color: #042548;">£${product.price}</div></td><td style="padding: 12px; text-align: right; width: 100px;"><a href="https://spacire.com/products/${product.handle}" style="background: #042548; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; display: inline-block;">View</a></td></tr></table>`;
        });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Shift Worker Sleep Plan</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr><td align="center" style="padding: 20px 10px;">
            <table cellpadding="0" cellspacing="0" border="0" width="650" style="max-width: 650px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <tr><td style="background: linear-gradient(135deg, #0a1628 0%, #1a237e 50%, #0d47a1 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Shift Worker Sleep Plan</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">Personalized schedule from Spacire</p>
                </td></tr>
                <tr><td style="padding: 40px 30px;">
                    <p style="font-size: 16px; color: #333; margin: 0 0 15px;">Hi ${firstName},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px;">Here's your personalized sleep schedule for your ${shiftLabel.toLowerCase()} pattern.</p>
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="display: inline-block; background: linear-gradient(135deg, #042548 0%, #1565c0 100%); color: white; padding: 10px 24px; border-radius: 50px; font-weight: 600; font-size: 14px;">${shiftLabel} Worker</span>
                        <p style="color: #666; font-size: 14px; margin: 10px 0 0;">Shift times: ${shiftStart} - ${shiftEnd}</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #f8fbff 0%, #e8f4ff 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; border: 1px solid #d0e3ff;">
                        <h3 style="color: #042548; margin: 0 0 20px; font-size: 18px;">&#128337; Your Optimal Sleep Schedule</h3>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody>${scheduleHtml}</tbody></table>
                    </div>
                    <h2 style="color: #042548; font-size: 20px; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 3px solid #E0B252;">&#128161; Personalized Tips</h2>
                    ${tipsHtml}
                    ${diyHtml ? `<h2 style="color: #042548; font-size: 20px; margin: 30px 0 20px; padding-bottom: 12px; border-bottom: 3px solid #E0B252;">&#128295; DIY Tips</h2>${diyHtml}` : ''}
                    ${productsHtml ? `<h2 style="color: #042548; font-size: 20px; margin: 30px 0 20px; padding-bottom: 12px; border-bottom: 3px solid #E0B252;">&#127873; Recommended Products</h2>${productsHtml}` : ''}
                    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 16px; margin-top: 30px;">
                        <div style="font-weight: bold; color: #856404; margin-bottom: 8px;">&#9888;&#65039; Health Note</div>
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">If you experience persistent sleep problems or symptoms of shift work disorder, please consult a healthcare provider.</p>
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 35px;">
                        <tr><td style="text-align: center;"><a href="https://spacire.com/collections/sleep-aids-for-shift-workers" style="display: inline-block; background: #042548; color: #fff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600;">Shop Shift Worker Essentials</a></td></tr>
                    </table>
                </td></tr>
                <tr><td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e6e6e6;">
                    <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Sleep well,<br><strong style="color: #042548;">The Spacire Team</strong></p>
                    <p style="margin: 15px 0 0; color: #999; font-size: 12px;">&copy; 2025 Spacire</p>
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

    const text = `YOUR SHIFT WORKER SLEEP PLAN\n\nHi ${firstName},\n\nShift: ${shiftLabel} (${shiftStart} - ${shiftEnd})\n\nSCHEDULE:\n${schedule ? schedule.map(item => `${item.time} - ${item.title}: ${item.desc}`).join('\n') : 'No schedule'}\n\nTIPS:\n${tips ? tips.map((tip, i) => `${i + 1}. ${tip.title}: ${tip.text}`).join('\n\n') : 'No tips'}\n\nVisit https://spacire.com/collections/sleep-aids-for-shift-workers\n\nThe Spacire Team`;

    return { html, text, subject: `Your ${shiftLabel} Sleep Plan - Personalized Schedule & Tips` };
}
