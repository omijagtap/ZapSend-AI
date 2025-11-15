'use server';

import {optimizeSubjectLine} from '@/ai/flows/subject-line-optimization';

export async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API with subject generation...');
    
    const testEmailContent = `
      Hi there! 
    
      I'm excited to share our new AI-powered email marketing tool that helps you 
      create better campaigns with zero cost. ZapSend AI uses advanced technology 
      to optimize your subject lines and personalize content for each recipient.
      
      Stop paying hundreds of dollars for email marketing platforms when you can 
      get better results for free!
      
      Best regards,
      The ZapSend AI Team
    `;

    const result = await optimizeSubjectLine({
      emailContent: testEmailContent
    });

    console.log('✅ Gemini API Test Successful!');
    console.log('Generated Subject Lines:', result.suggestedSubjectLines);
    
    return {
      success: true,
      subjectLines: result.suggestedSubjectLines
    };
    
  } catch (error) {
    console.error('❌ Gemini API Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
