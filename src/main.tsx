import { Devvit, SettingScope } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});


Devvit.addSettings([
  {
    type: 'boolean',
    name: 'lock_unlock_enabled',
    label: 'Enable both Lock and Unlock (if off, only Lock is enabled)',
    defaultValue: false
  },
]);

async function toggleCommentLock(
  event: { targetId: any },
  context: { reddit: any; ui: any; settings: any }
) {
  const { targetId } = event;
  const { reddit, ui, settings } = context;

  try {
    const post = await reddit.getPostById(targetId);
    const author = await post.getAuthor();
    const currentUser = await reddit.getCurrentUser();
    const lockStatus = post.isLocked();

    // Get the boolean setting
    const lockUnlockEnabled = await settings.get('lock_unlock_enabled');

    if (author.id === currentUser.id) {
      if (lockStatus) {
        if (lockUnlockEnabled) {
          await post.unlock();
          ui.showToast("Comments unlocked successfully");
        } else {
          ui.showToast("Unlocking comments by Author is disabled by the moderators.");
        }
      } else {
        await post.lock();
        ui.showToast("Comments locked successfully");
      }
    } else {
      ui.showToast("Only the post author can lock/unlock comments feature");
    }
  } catch (error) {
    console.error("Error toggling comment lock:", error);
    ui.showToast("Failed to toggle comment lock");
  }
}

// Add menu item for post authors
Devvit.addMenuItem({
  label: 'Lock/Unlock Comments',
  location: 'post',
  onPress: toggleCommentLock,
});

export default Devvit;