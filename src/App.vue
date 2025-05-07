<script setup>

import DiffEditor from "@/DiffEditor.vue";
import {ref} from "vue";

const srcValue = ref(`package terminal

import (
	"fmt"
	"strings"
)

func checkAndCreateUser(user string) string {
	return fmt.Sprintf("id %s &>/dev/null || useradd -m %s", user, user)
}

func switchUser(user string) string {
	return fmt.Sprintf("sudo -u %s", user)
}

func setEnvs() string {
	return fmt.Sprintf("export LANG=en_US.UTF-8; export TERM=xterm-256color")
}

func removeSudoCommandEnv() string {
	return "unset SUDO_COMMAND"
}

func createKubeConfigDir(kubeConfigJson string) string {
	return fmt.Sprintf("mkdir -p ~/.kube; touch ~/.kube/config; echo \"%s\" > ~/.kube/config", formatSpecialEchoString(kubeConfigJson))
}

func formatSpecialEchoString(str string) string {
	result := strings.Builder{}
	l := len(str)
	for i := 0; i < l; i++ {
		if specialCharacter(str[i]) {
			result.WriteRune('\\')
		}
		result.WriteByte(str[i])
	}
	return result.String()
}

func specialCharacter(c byte) bool {
	return c == '"' || c == '\'' || c == '$' || c == '\`' || c == '\\'
}`)
const destValue = ref(`package terminal

import (
	"fmt"
	"strings"
)

func checkAndCreateUser(user string) string {
	return fmt.Sprintf("id %s &>/dev/null || useradd -m %s", user, user)
}

func switchUser(user string) string {
	return fmt.Sprintf("sudo -u %s", user)
}

func setEnvs() string {
	return fmt.Sprintf("export LANG=en_US.UTF-8; export TERM=xterm-256color")
}

func removeSudoCommandEnv() string {
	return "unset SUDO_COMMAND"
}

func createKubeConfigDir(kubeConfigJson string) string {
	return fmt.Sprintf("mkdir -p ~/.kube; touch ~/.kube/config; echo \"%s\" > ~/.kube/config", FormatSpecialEchoString(kubeConfigJson))
}

func FormatSpecialEchoString(str string) string {
	result := strings.Builder{}
	l := len(str)
	for i := 0; i < l; i++ {
		if specialCharacter(str[i]) {
			result.WriteRune('\\')
		}
		result.WriteByte(str[i])
	}
	return result.String()
}

func specialCharacter(c byte) bool {
	return c == '"' || c == '\'' || c == '$' || c == '\`' || c == '\\'
}
`)

const sideBySide = ref(true)
</script>

<!--https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.DocumentHighlight.html-->
<template>
  <div class="mt-200px ml-10px  ">
    <button @click="sideBySide = !sideBySide" class="btn btn-outline">
      change state
    </button>
  </div>
  <DiffEditor v-model="destValue" :diff-value="srcValue" class="h-400px mt-10px" :render-side-by-side="sideBySide" />
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  min-width: 100px;
  gap: 6px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #dcdfe6;
  color: #606266;
}

.btn:active {
  transform: translateY(0);
}
</style>