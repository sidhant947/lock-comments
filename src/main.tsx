import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

async function toggleCommentLock(event: { targetId: any; }, context: { reddit: any; ui: any; }) {
  const { targetId } = event;
  const { reddit, ui } = context;

  try {
    const post = await reddit.getPostById(targetId);

    const author = await post.getAuthor();

    const currentUser = await reddit.getCurrentUser();

    const lockStatus = post.isLocked();


    if (author.id === currentUser.id) {
      if (lockStatus) {
        await post.unlock();
        ui.showToast("Comments unlocked successfully");
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