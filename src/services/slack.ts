import 'dotenv/config';
import { WebClient, ErrorCode } from '@slack/web-api';
import { loggr } from '../utils';

const token = process.env.SLACK_TOKEN;
const slackApi = new WebClient(token);

const handleError = (error: any) => {
  if (error?.code === ErrorCode.PlatformError) {
    loggr.error('Slack API returned an error:');
    loggr.error(error.data);
  } else {
    loggr.error('Slack API returned an unexpected error.');
  }
}

export const updateStatus = async (status_text: string, status_emoji: string, status_expiration = 0) => {
  try {
    await slackApi.users.profile.set({
      profile: JSON.stringify({
        status_text,
        status_emoji,
        status_expiration
      })
    });
  } catch (error) {
    handleError(error);
  }
}

export const clearStatus = async () => {
  await updateStatus('', '', 0);
}