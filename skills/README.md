# Custom Skills

Custom skills local directory.

## How to add a new skill

1. Duplicate an existing skill directory and rename it to the new skill name.
2. Alter the new skill directories file content to reflect the new skill.
3. **Important** Run `pnpx skills add -y ./skills/<skill-name>` to add the new skill to the project. If omitting the `-y` flag, the manual command wizard will be shown: select "Claude Code" as additional agent, use "Project" installation scope, "Symlink" installation method and select "Yes" when asked to proceed with installation. (Should all be pre-selected by default)

## How to update a skill

1. Alter the skill directories file content to reflect the new skill.
2. **Important** Run `pnpx skills add -y ./skills/<skill-name>` to apply the updated skill to the project. If omitting the `-y` flag, the manual command wizard will be shown: select "Claude Code" as additional agent, use "Project" installation scope, "Symlink" installation method and select "Yes" when asked to proceed with installation. (Should all be pre-selected by default)
