#!/bin/bash
# -----------------------------------------------------------------------------
#.
#. Script to display the Rules Yaml files in a more readable form (Markdown)
#. Usage:
#.   $ rules-md.sh -p <path to rules yaml folder> -o <output markdown file> -f <format: html|md>
#.
# NOTE: This is the "late night", "poor judegment" version ¯\_(ツ)_/¯
# -----------------------------------------------------------------------------


RULES_PATH=''
RULESDOC=''
FORMAT=''

#--------------------------------------
# Just tell me how to use it 
#--------------------------------------
usage()
{
    grep -e "^#\." $0 | sed 's/^#\./ /g'
}

#--------------------------------------
# A poormans arguments parser
#--------------------------------------
readCmdArgs()
{
    while [[ $# -gt 0 ]]
    do
        key="$1"

        case $key in
            -p|--path)
                RULES_PATH="$2"
                shift # past argument
                shift # past value
                ;;
            -o|--output)
                RULESDOC="$2"
                shift # past argument
                shift # past value
                ;;
            -f|--format)
                FORMAT=$(echo ${2} | tr '[:upper:]' '[:lower:]')
                shift # past argument
                shift # past value
                ;;
            *)  # unknown option
                shift # past argument
                ;;
        esac
    done

    # Verify that all Parameters are there
    # -------------------------------------
    if [ "$RULES_PATH" == "" ]; then
        echo Missing RULES_PATH
        exit 1
    fi

    if [[ "$RULESDOC" == "" && ! "$FORMAT" == "html" ]]; then
        RULESDOC='rules.md'
    fi


    if [[ "$RULESDOC" == "" && "$FORMAT" == "html" ]]; then
        RULESDOC='rules.html'
    fi

    # DEBUG
    echo   RULESDOC: $RULESDOC
    echo RULES_PATH: $RULES_PATH
}


#--------------------------------------
# create the markdown
#--------------------------------------
generateRulesMarkdown(){

    index=0

    for rule in $(ls -d ${RULES_PATH}/*.yml)
    do 
        index=$((index+1)) 
        rule_name=$(yq -r '.name' ${rule})
        echo "${index}. [${rule_name}](#Rule-${index})" >> ${RULESDOC} 
    done
    echo "---" >> ${RULESDOC}  
    
    index=0

    for rule in $(ls -d ${RULES_PATH}/*.yml)
    do 
        index=$((index+1))
        rule_name=$(yq -r '.name' ${rule})
        rule_description=$(yq -r '.description' ${rule})
        echo "" >> ${RULESDOC}
        echo "## Rule: \`${rule_name}\` " >> ${RULESDOC} 
        if [[ ! -z ${rule_description} ]]
        then
            echo "" >> ${RULESDOC}
            echo "${rule_description}" >> ${RULESDOC}
        fi
        echo "" >> ${RULESDOC}
        echo "**Rule Source:** [${rule}](${rule})" >> ${RULESDOC}
        echo "" >> ${RULESDOC}
        echo "### Conditions" >> ${RULESDOC}  
        echo "" >> ${RULESDOC}
        echo "|Fact(s)|Operator|Value|" >> ${RULESDOC}
        echo "|---|---|---|" >> ${RULESDOC}
        yq -r '.conditions.all[] | map(.) | @csv'  ${rule} | sed 's/^"/|/g' | sed 's/","/\|/g' | sed 's/"/|/g' >>  ${RULESDOC}
        echo "" >> ${RULESDOC}

        event_type=$(yq -r '.event.type' ${rule})
        data=""
        # for i in $(yq -r '.event.params.data | map(.) | @csv' ${rule} | sed 's/ /_/g')
        # do 
        #     i=$(echo $i | sed 's/\"/ /g')
        #     data="$(echo $i | sed 's/_/ /g') ${data}"
        # done
        data=$(yq -r '.event.params.data'  ${rule})
        echo "### Event Data" >> ${RULESDOC}  
        echo "" >> ${RULESDOC}
        echo "#### Event-Type: [\`${event_type}\`](src/eventHandlers/${event_type}.js) " >>  ${RULESDOC}
        echo "> (Name of the NodeJS EventHandler class)" >>  ${RULESDOC}
        echo "#### Data:" >>  ${RULESDOC}
        echo "" >>  ${RULESDOC}
        echo "\`\`\`" >>  ${RULESDOC}
        echo "${data}" >>  ${RULESDOC}
        echo "\`\`\`" >>  ${RULESDOC}
        echo "" >>  ${RULESDOC}
        echo "---" >> ${RULESDOC}  
    done
}

generateRulesHtml(){
    hasEventTypeColumn=0
    hasEventDataColumn=0
    index=0
    echo "<h1>Rules</h1>" >> ${RULESDOC} 

    for rule in $(ls -d ${RULES_PATH}/*.yml)
    do 
        rule_name=$(yq -r '.name' ${rule})
        rule_description=$(yq -r '.description' ${rule})

        echo "<div class=\"card-text\">" >> ${RULESDOC} 
        echo "<details>" >> ${RULESDOC}
        echo "<summary><b>Rule:</b> ${rule_name} &nbsp;&nbsp;&nbsp;&nbsp;(${rule_description})</summary>" >> ${RULESDOC}

        echo "<div style=\"padding: 10px;\" class=\"bg-secondary\" >" >> ${RULESDOC}
        echo "<table class=\"table table-hover table-striped\" style=\"padding: 0px\">" >> ${RULESDOC}
        echo "<th style=\"width: 5%;\">" >> ${RULESDOC}
        echo "Fact" >> ${RULESDOC}
        echo "</th>" >> ${RULESDOC}
        echo "<th>" >> ${RULESDOC}
        echo "Description" >> ${RULESDOC}
        echo "</th>" >> ${RULESDOC}
        echo "<th>" >> ${RULESDOC}
        echo "Condition" >> ${RULESDOC}
        echo "</th>" >> ${RULESDOC}
        echo "<th>" >> ${RULESDOC}
        echo "Event Type" >> ${RULESDOC}
        echo "</th>" >> ${RULESDOC}
        echo "<th>" >> ${RULESDOC}
        echo "Data" >> ${RULESDOC}
        echo "</th>" >> ${RULESDOC}
        echo "</tr>" >> ${RULESDOC}
        facts=$(yq -r '.conditions.all' ${rule})
        facts_length=$(echo $facts | yq '. | length')

        event_type=$(yq -r '.event.type' ${rule})
        event_params_data=$(yq -r '.event.params.data' ${rule})

        echo $facts | jq -c '.[]' | while read fact; do
            fDescription=$(echo "$fact" | jq '.description')
            fFact=$(echo "$fact" | jq '.fact')
            fOperator=$(echo "$fact" | jq '.operator')
            fValue=$(echo "$fact" | jq '.value')

            index=$((index+1))
            echo "<tr style=\"line-height: 1px;\">" >> ${RULESDOC}

            echo "<td class=\"table-dark\">" >> ${RULESDOC}
            echo "${index}" >> ${RULESDOC}
            echo "</td>" >> ${RULESDOC}

            if [[ "${fDescription}" != "null" ]]
            then
                echo "<td class=\"table-dark\">${fDescription}</td>" >> ${RULESDOC}
            else
                echo "<td class=\"table-dark\">NA</td>" >> ${RULESDOC}
            fi

            condition_text="If $(echo ${fFact} | sed 's/payload\.//g'), ${f1} ${fOperator}, ${fValue}"

            echo "<td class=\"table-dark\">${condition_text}</td>" >> ${RULESDOC}
            
            if [ $hasEventTypeColumn -eq 0 ]
            then
                hasEventTypeColumn=1
                echo "<td rowspan=$facts_length style=\"vertical-align: middle\" class=\"table-success\">${event_type}</td>" >> ${RULESDOC}
            fi

            if [ $hasEventDataColumn -eq 0 ]
            then
                hasEventDataColumn=1
                echo "<td rowspan=$facts_length class=\"table-primary\"  style=\"line-height: 15px;\">" >> ${RULESDOC}
                echo "<details>" >> ${RULESDOC}
                echo "<summary>Click to expand</summary>" >> ${RULESDOC}
                echo "<pre>" >> ${RULESDOC}
                echo "<code color=Cyan>" >> ${RULESDOC}
                echo "${event_params_data}" >>  ${RULESDOC}     
                echo "</code>" >> ${RULESDOC}
                echo "</pre>" >> ${RULESDOC}
                echo "</details>" >> ${RULESDOC}  
            fi
        done        
        echo "</table>" >> ${RULESDOC}
        echo "</div>" >> ${RULESDOC}
        echo "</details>" >> ${RULESDOC}  
        echo "</div>" >> ${RULESDOC}   
    done
}

# --- `main` ------------------------------------------------------------------

# If there are missing parameters, print the usage
if [ $# -lt 6 ]; then
    usage
    exit 1
fi

# DEBUG
echo   PARAMS: ${@%/}

readCmdArgs ${@%/}

echo FORMAT: $FORMAT 

case ${FORMAT}  in
    markdown|md)   
        echo "Creating Markdown"
        echo ${RULESDOC}
        # create the output .MD
        echo "# Rules" > ${RULESDOC}
        generateRulesMarkdown
        ;;
    html|web)
        echo "Creating HTML"
        echo ${RULESDOC}
        echo "<html>" > ${RULESDOC}
        echo "<head> \
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap.min.css" /> \
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-dark.min.css" /> \
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-print.min.css" /> \
            </head> \
            <body class=\"bootstrap-dark\" style=\"padding: 10px\"> " > ${RULESDOC}

        generateRulesHtml
        echo "</body></html>" >> ${RULESDOC}
        ;;
    *)   
        ;;
esac