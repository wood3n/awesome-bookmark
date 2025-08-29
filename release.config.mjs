/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main", { name: "beta", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/github",
      {
        assets: ["extension.zip"]
      }
    ],
    "@semantic-release/git"
  ]
};
