export class NavigationController {
  static init() {
    this.setupNavigationListeners();
    this.setDefaultActive();
  }

  static setupNavigationListeners() {
    // Desktop navigation
    document.getElementById('nav-habits')?.addEventListener('click', () => {
      this.setActiveTab('habits');
    });
    document.getElementById('nav-analytics')?.addEventListener('click', () => {
      this.setActiveTab('analytics');
    });
    document.getElementById('nav-settings')?.addEventListener('click', () => {
      this.setActiveTab('settings');
    });

    // Mobile navigation
    document.getElementById('mobile-habits')?.addEventListener('click', () => {
      this.setActiveTab('habits');
    });
    document.getElementById('mobile-analytics')?.addEventListener('click', () => {
      this.setActiveTab('analytics');
    });
    document.getElementById('mobile-settings')?.addEventListener('click', () => {
      this.setActiveTab('settings');
    });
  }

  static setActiveTab(tabType) {
    // Remove active from desktop nav
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`nav-${tabType}`)?.classList.add('active');

    // Remove active from mobile nav
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`mobile-${tabType}`)?.classList.add('active');

    // Show/hide sections
    this.showSection(tabType);
  }

  static showSection(sectionType) {
    document.querySelectorAll('section[id$="-view"]').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(`${sectionType}-view`)?.classList.remove('hidden');
  }

  static setDefaultActive() {
    this.setActiveTab('habits');
  }
}